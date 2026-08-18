import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Writable } from "node:stream";
import test from "node:test";
import assert from "node:assert/strict";
import { findGitRepos, prepare, run } from "./init.mjs";

function capture() {
  let text = "";
  const stdout = new Writable({
    write(chunk, _enc, cb) {
      text += String(chunk);
      cb();
    },
  });
  stdout.toString = () => text;
  return stdout;
}

function tmp() {
  return mkdtempSync(join(tmpdir(), "init-"));
}

test("prepare creates specs layers, .work, gitignore, does not overwrite index", () => {
  const root = tmp();
  mkdirSync(join(root, ".agents", "specs", "backend"), { recursive: true });
  writeFileSync(join(root, ".agents", "specs", "backend", "index.md"), "# keep me\n");
  const first = prepare(root);
  assert.ok(first.created.includes(".work"));
  assert.ok(first.created.some((p) => p.endsWith("frontend/index.md")));
  assert.equal(readFileSync(join(root, ".agents", "specs", "backend", "index.md"), "utf8"), "# keep me\n");
  const gi = readFileSync(join(root, ".gitignore"), "utf8");
  assert.match(gi, /\.work\//);
  assert.match(gi, /\.codegraph\//);
  const second = prepare(root);
  assert.ok(second.created.length < first.created.length);
});

test("findGitRepos sees nested repos and skips node_modules", () => {
  const root = tmp();
  mkdirSync(join(root, ".git"));
  mkdirSync(join(root, "svc-a", ".git"), { recursive: true });
  mkdirSync(join(root, "node_modules", "pkg", ".git"), { recursive: true });
  const repos = findGitRepos(root).map((p) => p.replace(/\\/g, "/"));
  assert.equal(repos.length, 2);
  assert.ok(repos.some((p) => p.endsWith("svc-a")));
  assert.ok(!repos.some((p) => p.includes("node_modules")));
});

test("prepare reports ask_which_repos when multiple git repos lack index", () => {
  const root = tmp();
  mkdirSync(join(root, "a", ".git"), { recursive: true });
  mkdirSync(join(root, "b", ".git"), { recursive: true });
  const report = prepare(root);
  assert.equal(report.gitRepos.length, 2);
  assert.equal(report.codegraph.action === "ask_which_repos" || report.codegraph.action === "ask_install", true);
});

test("run prepare prints json", () => {
  const root = tmp();
  const out = capture();
  const code = run(["node", "init.mjs", "prepare", "--root", root], out, capture());
  assert.equal(code, 0);
  const json = JSON.parse(out.toString());
  assert.ok(json.root);
  assert.ok(json.codegraph.installHint.includes("codegraph"));
});
