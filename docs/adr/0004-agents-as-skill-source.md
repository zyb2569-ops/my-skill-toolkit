# Skill 以 `.agents` 为唯一源

Skill 正文只维护在 `.agents/skills/`。这是 Codex / Pi / 部分 Agent Skills 宿主的共用目录，避免在 `.cursor`、`.claude` 各写一份。需要给 Cursor、Claude Code 用时，从 `.agents/skills` 做链接或复制，不把宿主目录当源。
