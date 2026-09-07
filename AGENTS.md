# AGENTS.md

# AI Agent Project Instructions

## 1. Purpose

This file defines the mandatory operating rules for the AI coding agent working on this project.

The project contains reusable AI skills inside:

`AI Agent Skills/`

These skills are part of the project's engineering standards.

The agent MUST use applicable skills when working on this project.

---

# 2. Mandatory Skill Discovery

Before starting ANY coding task, the agent MUST:

1. Inspect the `AI Agent Skills/` directory.
2. Identify all available skills.
3. Determine which skills are relevant to the requested task.
4. Read the relevant skill files completely before implementing changes.
5. Treat applicable skills as mandatory project instructions.
6. Apply the skills throughout the entire task:
   - Planning
   - Implementation
   - Debugging
   - Refactoring
   - Testing
   - Code review
7. Before finishing, verify that the implementation complies with all applicable skills.

Do NOT assume that only previously known skills exist.

If a new skill has been added to `AI Agent Skills/`, discover and consider it automatically.

---

# 3. Always-On Clean Code Skill

The Clean Code skill is ALWAYS applicable.

The agent MUST read and follow:

`AI Agent Skills/clean-code-agent-skill.md`

for EVERY coding task.

This includes:

- New features
- Bug fixes
- Refactoring
- UI changes
- Database changes
- API changes
- Architecture changes
- Tests
- Configuration changes
- Performance work
- Code reviews

The Clean Code skill is the baseline engineering standard for this project.

---

# 4. Task-Specific Skills

Other skills inside `AI Agent Skills/` MUST be used whenever their subject is relevant to the current task.

Examples:

```text
UI task
    → Load the UI/design skill

Database task
    → Load the database skill

Testing task
    → Load the testing skill

API task
    → Load the API skill

Architecture task
    → Load the architecture skill
