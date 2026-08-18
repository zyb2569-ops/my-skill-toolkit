# Skills 工具包

个人/团队用的 AI 编码辅助工具包：按需注入规范，用 PRD 卡住大改动，用任务跨会话续跑。不维护会话记忆，不绑死实现方法。

## Language

**工具包**:
本仓库。Skill 源码在根目录 `skills/`。装到业务仓时复制进 `.agents/skills/`。
_Avoid_: 平台, framework

**业务仓**:
真正改代码的那个仓库。规范、Skill 副本、进行中的任务都住在这里。
_Avoid_: 工作区（口语可混用；文档里工作区特指业务仓内未归档的文件树）

**Skill 源**:
业务仓内 Skill 的唯一维护位置：`<业务仓>/.agents/skills/`。需要时给同仓 `.cursor/skills`、`.claude/skills` 做 symlink。不把用户主目录 `~/.agents` 当第一期安装目标。
_Avoid_: 各宿主目录各写一份, 全局 Skill 目录

**规范**:
按规范索引按需注入的项目约定正文，存放在业务仓的 `.agents/specs/`。模型不靠记住它。
_Avoid_: guideline（口语可混用，文档里用规范）, memory, journal

**规范层**:
规范的固定三层：前端、后端、通用。目录为 `frontend/`、`backend/`、`common/`，每层一份 `index.md`。
_Avoid_: 按包再拆一层, 自由分类名, shared, 中文目录名

**规范索引**:
三层各自的 `index.md`。加载时由脚本扫成一张扁平编号表，模型输入一个或多个数字即可拿到对应规范全文。每份 index 必须有「何时读哪些规范」和「改完对照什么」。
_Avoid_: 手写总编号表, 单文件总目录

**命中记录**:
某条规范被选用的次数，按文件路径累计，存在 `.agents/specs/.hits.json` 且 gitignore。用来发现长期不用的旧规范，供人决定是否淘汰。
_Avoid_: hit_count（Trellis `tl mem` 的会话搜索命中）

**琐碎改动**:
错别字、格式、注释、明显一行修复。不跑规范索引，不建任务。
_Avoid_: trivial（文档里用中文）

**普通改动**:
真改代码，但不是大改动。跑规范索引、多选规范、不写 PRD。仅当模型估计本会话做不完时才建任务。
_Avoid_: hotfix, tweak

**大改动**:
会改变业务流程、代码行为、或影响上下游的变更。必须先产出 PRD。
_Avoid_: epic, change（Comet/OpenSpec 的 change 目录）

**PRD**:
大改动的决策与验收依据。用 grill-with-docs 一类访谈整理而成，后续任务对照它验收。
_Avoid_: brief, proposal, OpenSpec spec

**任务**:
一次改动的跨会话执行上下文。目录为 `.work/<短名>/`：`prd.md`（仅大改动）、`design.md`、`task.md`（影响范围、文件、进度、验收项）。大改动必建；普通改动仅估计本会话做不完才建；琐碎改动不建。进行中 gitignore，你明确说「归档」后整夹搬到归档区。
_Avoid_: issue, ticket, comet change, implement.md

**归档区**:
用户主目录下按项目分的池：`~/agent-archive/<项目名>/`（Windows 为 `%USERPROFILE%\agent-archive\<项目名>\`）。已完成的 PRD 与任务移到这里，不进业务仓 git。
_Avoid_: workspace journal, 业务仓同级目录, 业务仓内 archive/

**工作路径**:
业务仓里工具包依赖的目录：`.agents/specs/` 三层、`.work/`、归档区、以及可选的 `.codegraph/`。由 `init` 一次性建齐。
_Avoid_: 把它当成 Trellis `.trellis/` 整树

**CodeGraph 索引**:
业务仓（或其中某个 git 子仓）下的 `.codegraph/` 本地代码图谱。`init` 在缺索引时按 CLI 是否可用、是否多仓来建或询问。不是会话记忆。
_Avoid_: journal, GitNexus

**记忆**:
本工具包明确不做的机制。不维护跨会话日记或自动记忆；过时记忆会与现状冲突，维护成本高于收益。
_Avoid_: 把它当成要建设的功能
