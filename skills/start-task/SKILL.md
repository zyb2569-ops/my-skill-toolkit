---
name: start-task
description: Use when creating a `.work/<slug>/` task so a change can resume across sessions, including 大改动 after a PRD exists, or a 普通改动 that will not finish in this session. Also use when the user says 建任务 / start-task.
---

# start-task

在业务仓建进行中任务。不维护「当前任务」指针；`.work/` 里有几个目录就是几件进行中的事。

## 何时建

- **大改动**：必建（有 PRD 要验收和归档）
- **普通改动**：仅估计本会话做不完
- **琐碎改动**：不建

## 步骤

1. 短名：小写英文/数字/连字符，例如 `pack-import`。不要日期前缀。若 `.work/<短名>/` 已存在，换名或问用户。
2. 确保 `.gitignore` 含：

```
.work/
.agents/specs/.hits.json
.codegraph/
```

3. 建目录并写文件（从本 Skill `templates/` 拷）：

```
.work/<短名>/
  prd.md       # 仅大改动；把 grill 产出贴进来
  design.md    # 大改动必有；普通+任务可省略
  task.md      # 必有
```

4. `task.md` 必须有：目标（大改动写「见 prd.md」）、设计方案（或「见 design.md」）、影响范围、拟改/已改文件、进度、验收项（大改动从 PRD 抄可勾项；普通改动当场写几条）。

不要写 `implement.md`，不要规定 TDD/分阶段怎么写代码。

5. 大改动：建好后 `load-specs`（若还没加载）。普通+任务：若还没加载规范，先 `load-specs` 再继续改代码。
