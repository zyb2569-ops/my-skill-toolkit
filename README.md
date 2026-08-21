# winin-dev-sop

按需注入规范，用 PRD 卡住大改动，用 `.work/` 跨会话续跑。不做记忆，不绑死实现方法。所有 Skill 以 `sop-` 为前缀，混装时可辨归属。

需求：[需求文档.md](需求文档.md)。术语：[CONTEXT.md](CONTEXT.md)。

## 这套东西干什么

业务仓里放项目规范（`.agents/specs/`），工具包只提供 Skill。改代码前按编号加载规范；大改动先访谈写出 PRD；做不完的活写成任务，你说「归档」再搬出仓库。

不强行 TDD、不串 OpenSpec / Superpowers、没有 Trellis 三阶段状态机。

## 九个 Skill

| Skill | 何时用 |
|-------|--------|
| `sop-init` | 第一次进业务仓：建工作路径，处理 CodeGraph 索引 |
| `sop-load-specs` | 非琐碎改动、准备写代码 |
| `sop-grill-with-docs` | 已确认的大改动，产出 PRD |
| `sop-start-task` | 大改动必建；普通改动估计本会话做不完才建 |
| `sop-archive-task` | 用户明确说「归档」 |
| `sop-commit-code` | 用户明确说「提交」：只提交业务代码，说明为 `动作(模块):具体内容` |
| `sop-find-simplifications` | 用户说简化、找死代码、收敛重复、删无用代码 |
| `sop-trim-cot-leakage` | 写规范、设计说明、注释、JSDoc 等说明性文字时立刻 Read，不必等用户点名 |
| `sop-review-diff` | 用户说审查这次改动、查过度设计：审当前未提交改动，产出删除清单 |

源码在仓库根目录 `skills/`。装到业务仓时**复制**到 `.agents/skills/`，不要 submodule，不要把工具包链过去。

## 日常怎么走

模型先分档（模糊则升一档）。大改动必须先讲理由，**你确认**再写 PRD。

| 档 | 规范 | PRD | 任务 |
|----|------|-----|------|
| 琐碎（错别字/格式/注释/一行修复） | 不加载 | 无 | 不建 |
| 普通 | `sop-load-specs` | 无 | 估计本会话做不完才建 |
| 大改动（业务流程 / 代码行为 / 上下游） | 执行时加载 | 必有 | 必建 |

一条路径，没有精简/完整两套入口。

## 第一次装到业务仓

1. 把本仓库的 `skills/` **里面的各个 Skill 目录**复制到业务仓的 `.agents/skills/`（复制后应直接看到 `.agents/skills/sop-init/SKILL.md`，不要多套一层 `skills`）。

```powershell
New-Item -ItemType Directory -Force .agents\skills | Out-Null
Copy-Item -Recurse -Force \path\to\my-skill-toolkit\skills\* .agents\skills\
```
2. 在业务仓根目录对 Agent 说「用 sop-init 初始化」，或自己跑：

```bash
node .agents/skills/sop-init/scripts/init.mjs prepare
```

`sop-init` 会：

- 建 `.work/`、`.agents/specs/{frontend,backend,common}/index.md`（已有 index 不覆盖）
- 把忽略规则并进 `.gitignore`
- 把 Skill 路由块追加进根目录 `AGENTS.md`（已有内容保留；重复跑只更新 `<!-- AGENT-SKILLS:START -->` … `END` 这一段）
- 建 `~/agent-archive/<业务仓目录名>/`（Windows 在 `%USERPROFILE%\agent-archive\`）
- 给 Cursor / Claude Code 建 junction
- 检查 CodeGraph：没有索引则看 `codegraph` 在不在 PATH；在就建索引；多个代码仓先给你方案；命令没有则问你装不装，不装就跳过

3. 规范正文你自己往三层目录里加。index 必须有「何时读哪些规范」和「改完对照什么」。模板：`skills/sop-init/templates/index.md`。`AGENTS.md` 路由块模板：`skills/sop-init/templates/AGENTS.md`（装进业务仓后都在 `.agents/skills/sop-init/templates/`）。

手工 junction（`sop-init` 没做成时）：

```powershell
New-Item -ItemType Directory -Force .cursor\skills, .claude\skills | Out-Null
foreach ($name in @("sop-init","sop-grill-with-docs","sop-load-specs","sop-start-task","sop-archive-task","sop-commit-code","sop-find-simplifications","sop-trim-cot-leakage","sop-review-diff")) {
  foreach ($hostDir in @(".cursor\skills", ".claude\skills")) {
    $link = Join-Path $hostDir $name
    if (Test-Path $link) { Remove-Item $link -Force }
    cmd /c mklink /J $link ((Resolve-Path ".agents\skills\$name").Path)
  }
}
```

Codex / Pi 直接读 `.agents/skills/`。装完后新开会话。

## 从旧版升级（skill 更名 sop- 前缀）

2026-08 之前安装的业务仓里是旧名目录（init、start-task 等），两种迁法任选：

1. 删掉业务仓 `.agents/skills/` 下全部旧目录，按「第一次装到业务仓」重新复制，再重跑 `sop-init`；
2. 或把每个目录名加 `sop-` 前缀，再按上面手工 junction 脚本重建 `.cursor\skills`、`.claude\skills` 链接。

`.agents/specs/`、`.work/`、归档区不受影响，无需迁移。

## 业务仓目录

```
<业务仓>/
  .agents/
    skills/                 # 从工具包 `skills/` 拷来
      sop-init/
      sop-grill-with-docs/
      sop-load-specs/scripts/   # 列编号、记命中
      sop-start-task/
      sop-archive-task/
      sop-commit-code/
      sop-find-simplifications/
      sop-trim-cot-leakage/
      sop-review-diff/
    specs/
      frontend/index.md
      backend/index.md
      common/index.md
      .hits.json            # gitignore
  .work/                    # gitignore，进行中任务
  .codegraph/               # gitignore，CodeGraph 索引（sop-init 按需建）
  .cursor/skills/           # junction → .agents/skills
  AGENTS.md                 # 追加托管路由块，不覆盖原有段落
  .gitignore                # 含 .work/、.hits.json、.codegraph/
```

`.gitignore` 片段在工具包根目录 `gitignore.fragment`。`sop-init` 也会把同样规则并进业务仓 `.gitignore`。

## CodeGraph

用的是 `@colbymchenry/codegraph` 的本地索引（`.codegraph/`）。Agent 有图可查，少靠乱搜。

- 单个缺索引的 git 仓：CLI 可用就执行 `codegraph init`
- 外壳下挂了多个 git 仓：列出各仓是否已有索引，给你选「只建哪个 / 全建 / 跳过」
- `codegraph` 不在 PATH：问你是否 `npm i -g @colbymchenry/codegraph`。说不装，就跳过，不影响工作路径
- 不替你跑 `codegraph install`（那是改 Cursor/Claude 的 MCP，和本工具包分开）

## 规范怎么加载

准备写代码且不是琐碎改动时用 `sop-load-specs`：

```bash
node .agents/skills/sop-load-specs/scripts/specs.mjs list
node .agents/skills/sop-load-specs/scripts/specs.mjs pick "1,3,7"
node .agents/skills/sop-load-specs/scripts/specs.mjs hits
```

PowerShell 里编号必须加引号。命中按**文件路径**记在 `.agents/specs/.hits.json`，不进 git。没有 Node 时按同样规则自己扫三层 `index.md`。

## 任务和归档

```
.work/<yyyy-MM-dd-主题>/
  prd.md       # 仅大改动
  design.md    # 大改动必有
  task.md      # 目标、影响范围、文件、进度、验收项
```

短名必须带创建当天本地日期，格式 `yyyy-MM-dd-主题`，例如 `2026-08-20-pack-import`。你说「归档」后整夹搬到 `~/agent-archive/<项目名>/<短名>/`。一次 git commit 不等于完成。归档时会问要不要把新约定写进规范，AI 只建议。

## 测脚本（在工具包仓库）

```bash
node --test skills/sop-load-specs/scripts/specs.test.mjs
node --test skills/sop-init/scripts/init.test.mjs
```

## 明确不做

会话记忆、OpenSpec、Superpowers、Trellis 状态机、独立 CLI 平台、中央规范库、从 `.trellis` 自动迁移、整份覆盖业务仓 `AGENTS.md`、第一期写 `CLAUDE.md`。
