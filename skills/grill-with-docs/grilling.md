# grilling

Interview until shared understanding. Map a **design tree**: every decision branches into the decisions that hang off it.

Work in **rounds**. The **frontier** is every decision whose prerequisites are already settled. Ask the whole frontier in one round: number each question and give a recommended answer. Wait for answers before the next round.

Format:

```
❓ **Q1** - **<title>**: <body, options if any>

➡️ <recommended answer>
```

A question that depends on another still open this round belongs to a later round.

Finding **facts** is the agent's job (filesystem, tools, sub-agents). Don't ask the user what you can look up. **Decisions** are the user's.

The session is done when the frontier is empty. Do not implement until the user confirms shared understanding.
