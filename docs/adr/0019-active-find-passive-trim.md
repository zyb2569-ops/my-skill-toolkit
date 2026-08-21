# 简化主动触发，会话泄漏被动挂在写文档上

`find-simplifications` 只在用户要简化时跑；`trim-cot-leakage` 在写将提交的说明性文字时由模型自己加载，不靠用户点名。否则 trim 会变成没人叫的死 Skill，find 会在每次写文档时误扫代码表面。PRD 仍只走 `doc-voice`：PRD 本来就是变更叙事，不是 HEAD 上的现在时说明。
