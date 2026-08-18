# 增加 init：工作路径 + CodeGraph

在四个执行 Skill 之外增加 `init`。进业务仓先建 `.agents/specs` 三层、`.work/`、归档目录和 gitignore。CodeGraph 用 `@colbymchenry/codegraph`：已有 `.codegraph/` 则跳过；CLI 可用且单仓则 `codegraph init`；多仓列出方案等人选；CLI 不可用则询问是否 `npm i -g @colbymchenry/codegraph`，不装就跳过索引。不跑 `codegraph install`（MCP 接线另说）。
