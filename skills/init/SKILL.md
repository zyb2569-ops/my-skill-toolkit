---
name: init
description: Use when first setting up this toolkit in a business repo, when required working paths are missing, or when the user says init / 初始化 / 安装工作目录. Also use to check or build a CodeGraph index.
---

# init

在**当前业务仓根目录**建齐工作路径，并处理 CodeGraph 索引。不改产品代码，不覆盖已有 `index.md`。

## 步骤

1. 在业务仓根目录运行：

```bash
node .agents/skills/init/scripts/init.mjs prepare
```

没有 Node：手工建这些路径（已有的跳过）：

```
.work/
.agents/specs/frontend/index.md
.agents/specs/backend/index.md
.agents/specs/common/index.md
~/agent-archive/<业务仓目录名>/
```

把忽略规则并进 `.gitignore`（工具包根目录的 `gitignore.fragment` 与脚本内置规则一致）。index 模板在本 Skill 的 `templates/index.md`，把 `{{Layer}}` 换成 Frontend / Backend / Common。

2. 读脚本 JSON。`created` 是新建的，`skipped` 是本来就有的。

3. 给 Cursor / Claude Code 建 junction（已存在可跳过）：

```powershell
New-Item -ItemType Directory -Force .cursor\skills, .claude\skills | Out-Null
foreach ($name in @("init","grill-with-docs","load-specs","start-task","archive-task")) {
  foreach ($hostDir in @(".cursor\skills", ".claude\skills")) {
    $link = Join-Path $hostDir $name
    if (Test-Path $link) { Remove-Item $link -Force }
    cmd /c mklink /J $link ((Resolve-Path ".agents\skills\$name").Path)
  }
}
```

Codex / Pi 读 `.agents/skills/`，不必链。

4. **CodeGraph**（看 JSON 里 `codegraph.action`）：

| action | 怎么做 |
|--------|--------|
| `already_indexed` | 已有 `.codegraph/`，不再建 |
| `init_here` | CLI 可用且只有一个缺索引的仓：在该目录跑 `codegraph init` |
| `ask_which_repos` | 业务仓下有**多个** git 仓缺索引。列出 `gitRepos`（路径、是否已有索引），给出方案等人选，**不要擅自全建** |
| `ask_install` | `codegraph` 命令不可用。问用户要不要装。要：`npm i -g @colbymchenry/codegraph`，装完再按上面三条走。不要：跳过索引，init 仍算成功 |

多仓方案示例（等人回编号）：

```
1. 只索引 <主仓>
2. 全部索引：a, b, c
3. 跳过 CodeGraph
```

用户选定后，对每个目标目录执行 `codegraph init`（在该仓根目录，不是业务仓外壳）。索引可能要几分钟，等它跑完。

不要跑 `codegraph install`（那会改宿主 MCP 配置，不是本 Skill 的范围）。

5. 向用户汇报：建了哪些路径、CodeGraph 做了什么或为什么跳过。
