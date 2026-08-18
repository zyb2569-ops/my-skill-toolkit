# 第一期四个 Skill、按仓复制、Node 脚本

第一期先做 `grill-with-docs`、`load-specs`、`start-task`、`archive-task`。从工具包复制进业务仓 `.agents/skills/`，再 symlink 到 Cursor/Claude。列索引和记命中用 Node 标准库脚本，保证编号表和 `.hits.json` 不是模型手改出来的。没有 Node 时按同一规则降级为模型自己扫目录。

已被 [0014-init-and-codegraph](0014-init-and-codegraph.md) 增补 `init` Skill。
