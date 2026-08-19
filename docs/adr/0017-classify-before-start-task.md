# 建任务先分档，不直达 start-task

`AGENTS.md` 若把「建任务」单行映射到 `start-task`，大改动会在未确认、未访谈时就建目录、用模板填 PRD。决定：路由块先分档；「创建任务 / 建个任务 / 开任务」由 `start-task` 的 description 匹配，若判定为大改动且还没有 grill 产出的 PRD，则转交 `grill-with-docs`。不把「创建任务」写进 grill 的 description，否则它会变成任务专项 Skill，其它大改动仍然匹配不上。
