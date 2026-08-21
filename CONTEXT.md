# Skills 工具包

个人/团队用的 AI 编码辅助工具包：按需注入规范，用 PRD 卡住大改动，用任务跨会话续跑。不维护会话记忆，不绑死实现方法。

## Language

**winin-dev-sop**:
本工具包的包名，也是 skill 统一前缀 `sop-` 的来源：九个 skill 均为 sop- 开头，混装时可辨归属。
_Avoid_: 无前缀旧名（init、start-task 等）, 全前缀 winin-dev-sop-init

**工具包**:
本仓库，即 winin-dev-sop。Skill 源码在根目录 `skills/`。装到业务仓时复制进 `.agents/skills/`。
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

**分档**:
模型把一次改动归为琐碎、普通或大改动，再选 Skill。模糊则升一档。用户说「创建任务」也先分档，不直接 `sop-start-task`。
_Avoid_: 精简/完整两套入口, severity, priority

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
大改动的决策与验收依据。用 sop-grill-with-docs 一类访谈整理而成，后续任务对照它验收。
_Avoid_: brief, proposal, OpenSpec spec

**任务**:
一次改动的跨会话执行上下文。目录为 `.work/<短名>/`，短名是 `yyyy-MM-dd-` 加主题（小写英文/数字/连字符），例如 `2026-08-20-pack-import`。目录内：`prd.md`（仅大改动）、`design.md`、`task.md`（影响范围、文件、进度、验收项）。大改动必建；普通改动仅估计本会话做不完才建；琐碎改动不建。进行中 gitignore，你明确说「归档」后整夹搬到归档区。
_Avoid_: issue, ticket, comet change, implement.md

**归档区**:
用户主目录下按项目分的池：`~/agent-archive/<项目名>/`（Windows 为 `%USERPROFILE%\agent-archive\<项目名>\`）。已完成的 PRD 与任务移到这里，不进业务仓 git。
_Avoid_: workspace journal, 业务仓同级目录, 业务仓内 archive/

**工作路径**:
业务仓里工具包依赖的目录：`.agents/specs/` 三层、`.work/`、归档区、以及可选的 `.codegraph/`。由 `sop-init` 一次性建齐。`sop-init` 还会把路由块追加进根目录 `AGENTS.md`。
_Avoid_: 把它当成 Trellis `.trellis/` 整树

**路由块**:
`sop-init` 写入业务仓 `AGENTS.md` 的托管段落，起止标记为 `<!-- AGENT-SKILLS:START -->` / `END`。内容是何时调用哪个 Skill 的短表，用来提高每会话触发率。不覆盖标记外的原文；重复跑 `sop-init` 只更新这一段。
_Avoid_: 整文件覆盖 AGENTS.md, 第一期写 CLAUDE.md

**CodeGraph 索引**:
业务仓（或其中某个 git 子仓）下的 `.codegraph/` 本地代码图谱。`sop-init` 在缺索引时按 CLI 是否可用、是否多仓来建或询问。不是会话记忆。
_Avoid_: journal, GitNexus

**提交**:
用户明确说「提交」时走 `sop-commit-code`。只提交改动的业务代码，不能带任何配置文件和单测。说明格式为 `动作(模块):具体内容`。一次 commit 不等于归档。
_Avoid_: 把测试和配置顺手提交, 写完代码自动 commit

**记忆**:
本工具包明确不做的机制。不维护跨会话日记或自动记忆；过时记忆会与现状冲突，维护成本高于收益。
_Avoid_: 把它当成要建设的功能

**会话泄漏**:
已提交正文从作者会话视角说话，HEAD 上的读者无法核对每处引用和断言。典型是注释还在说「这次 PR」「以前是」「评审否决了」。
_Avoid_: CoT, 思维链残留, AI 味（那是 PRD 的 doc-voice）, 去 AI 套话

**完整命题**:
一段文字里调用方要依赖的事实：谁、在什么条件下、必须/可以/禁止、失败会怎样。删字或改写前先数清；命题还在，才允许丢掉会话口气。
_Avoid_: 完整意思（口语可混用）, 语感, 文风

**简化候选**:
`sop-find-simplifications` 的产出：带调用方证据的删、折或降级项。没点名路径或模块就停；用户明确说「全仓」才全仓。列完清单就停，等人挑了再按候选分档落地。
_Avoid_: Agent Note, 待办当方案, knip 报告, 列完接着改

**交接规则**:
删一段文字会改变承诺行为、公开接口或上下游时，trim 停手，把它变成简化候选；简化落地后若还在写注释/文档，再按被动触发跑 trim。trim 不因为「做过一次简化」就去扫全仓。
_Avoid_: 合成一个 Skill, 自动全仓互调, 用户点名才 trim

**主动触发**:
用户说法对上才 Read 并执行。`sop-find-simplifications` 属于这一类：简化、找死代码、收敛重复。
_Avoid_: 每次改代码都扫一遍, 写文档时顺手简化

**被动触发**:
模型进入该类工作就自己 Read，用户不必点名。`sop-trim-cot-leakage` 属于这一类：正在写或改将进仓库的说明性文字时用。
_Avoid_: 用户手动指定去痕迹, 提交时全仓扫描, 把它做成和 sop-commit-code 一样的口令 Skill

**说明性文字**:
将进仓库、对现在的代码负责的说明：规范、设计说明、README、注释、JSDoc、Skill 正文。
_Avoid_: PRD（变更叙事，走 doc-voice）, 聊天记录, 提交说明

**边写边守**:
`sop-trim-cot-leakage` 的用法：当场按规则落笔，不出审计表、不另起一遍 pass。改已有文字只动这次碰到的段落。
_Avoid_: doc-voice 式 subagent pass, 写完再扫全文件

**硬挂钩**:
会写 `design.md` 或动手写 `.agents/specs/` 的 Skill 步骤里写死「写这些文件时 Read trim」。注释、JSDoc、Skill 正文没有独立入口，靠 `description` 和路由块。
_Avoid_: 每个 Skill 都加一句, 只改 description 不改路由和步骤

**sop-review-diff**:
增量审查 Skill：对当前未提交改动查过度构建，产出带净效果统计的删除清单。默认只审未提交改动，点名才扩大；列完即停。
_Avoid_: 全仓审计（存量走 sop-find-simplifications）, 列完接着改, 英文标签输出

**复用阶梯**:
写码前依次检查的七级顺序，停在最先成立的一档。①需要存在：没有真实调用方或需求支撑的代码不写，拿不准先问；②代码库已有：同功能的函数、工具、模式已经存在就复用，不重写第二份；③标准库：语言或运行时自带的能力（日期格式化、集合操作、正则等）直接用，不手搓；④平台原生：平台内置特性（如原生 `<input type="date">`、框架路由）优先于自建组件或引依赖；⑤已装依赖：项目里已有的库能解决就用它，不为一个小功能新增依赖或另写包装；⑥一行：逻辑能用一行清晰表达（如 `dict(zip(keys, values))`）就不展开成多行循环；⑦最小实现：以上都不成立时，写满足当前需求的最小代码，不加没人要求的抽象、配置项和预留参数。规范成品随 sop-init 复制进业务仓 common 层。
_Avoid_: YAGNI 清单, 复用优先原则, 逐仓重写
