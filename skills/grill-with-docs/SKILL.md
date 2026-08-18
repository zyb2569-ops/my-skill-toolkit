---
name: grill-with-docs
description: Use when a change would alter business flow, code behavior, or upstream/downstream systems and needs a PRD; or when the user says grill, 大改动, PRD, grill-with-docs.
---

# grill-with-docs

大改动访谈。边问边写术语和 ADR，对齐后产出 PRD。实现方法不在这里规定。

未得到用户确认「这是大改动」之前，不要写产品代码、不要 `start-task`。

## 步骤

1. 若用户还没确认大改动：先给出结论和理由，停。确认后再继续。
2. 读本目录 [grilling.md](grilling.md)，按设计树一轮问完整个 frontier（编号问题 + 推荐答案），等用户回答再问下一轮。事实自己查，决策留给用户。
3. 读 [domain-modeling.md](domain-modeling.md)。术语一锤定音就写入当前仓库 `CONTEXT.md`（格式见 [CONTEXT-FORMAT.md](CONTEXT-FORMAT.md)）。三条都满足才写 ADR（格式见 [ADR-FORMAT.md](ADR-FORMAT.md)）：难逆转、缺了会让人奇怪、当时有过取舍。
4. frontier 空了、用户确认理解一致后，按 [prd-template.md](prd-template.md) 写出 PRD 全文。
5. 调用 `start-task` 把 PRD/设计/任务落到 `.work/<短名>/`。不要把 PRD 只留在对话里。
6. 之后改代码前用 `load-specs`。对照 PRD 验收，不对照聊天记录。

不要调用名为 `grilling` / `domain-modeling` 的外部 Skill；协议已在本目录。
