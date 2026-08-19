# init 把 Skill 路由块追加进 AGENTS.md

Skill 描述靠模型匹配，触发不稳定。`AGENTS.md` 会被 Cursor / Codex 等宿主每会话注入，所以 `init` 把一份短路由表追加进业务仓已有的 `AGENTS.md`。用 `<!-- AGENT-SKILLS:START -->` / `END` 包住：不覆盖文件其余内容；重复跑只更新这一段，避免叠两份。第一期不写 `CLAUDE.md`，避免两处正文分叉。
