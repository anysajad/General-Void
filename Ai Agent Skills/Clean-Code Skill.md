# Clean Code Engineering Skill

## Purpose

This skill makes the coding agent consistently apply the core engineering principles from Robert C. Martin's *Clean Code* when designing, implementing, reviewing, refactoring, and modifying software.

The goal is not to mechanically follow arbitrary rules. The goal is to produce code that is:

- Easy to read.
- Easy to understand.
- Easy to test.
- Easy to modify.
- Difficult to misuse.
- Consistent and maintainable.
- Simple rather than clever.

**Primary rule:**

> Write code for the human who will maintain it, not merely for the machine that executes it.

---

# 1. Mandatory Clean Code Mindset

Before considering a coding task complete, evaluate the implementation from the perspective of a developer who has never seen the code before.

The agent MUST ask:

1. Can I understand what this code does without mentally executing every line?
2. Are names meaningful and precise?
3. Does each function have one clear responsibility?
4. Does each class have one clear responsibility?
5. Is the code unnecessarily complicated?
6. Is logic duplicated?
7. Are errors handled intentionally?
8. Is the behavior easy to test?
9. Can future changes be made without touching unrelated code?
10. Would a future maintainer understand why the code exists?

If the answer to any of these is clearly "no", improve the implementation before finishing the task.

---

# 2. Meaningful Naming

Names MUST communicate intent.

Prefer:

```text
elapsedDays
remainingBalance
calculateCustomerBalance
findActiveCustomer
recordPayment
```

Avoid vague names such as:

```text
d
x
data
temp
obj
thing
process
handle
doStuff
```

Unless the meaning is genuinely obvious from a tiny local context.

## Naming Rules

- Variables should describe what they contain.
- Functions should describe what they do.
- Classes should describe what they represent.
- Boolean names should communicate a yes/no condition.
- Avoid abbreviations unless they are universally understood in the project.
- Avoid misleading names.
- Avoid generic names such as `Manager`, `Processor`, `Handler`, or `Utils` when a more precise name is possible.

Prefer:

```text
CustomerRepository
DebtCalculator
PaymentValidator
CustomerSearchService
```

over vague catch-all classes.

---

# 3. Functions Must Be Small and Focused

A function MUST have one clear responsibility.

Prefer:

```text
createCustomer()
    -> validateCustomer()
    -> saveCustomer()
    -> publishCustomerCreatedEvent()
```

over one giant function containing validation, persistence, calculations, notifications, logging, and UI behavior.

## Function Rules

- Keep functions short when practical.
- Give each function one clear purpose.
- Keep abstraction levels consistent within a function.
- Avoid deeply nested conditionals.
- Avoid excessive parameters.
- Avoid boolean flags that change a function into multiple unrelated behaviors.
- Prefer descriptive functions over comments explaining what a block does.
- Extract meaningful operations into named functions when doing so improves readability.

A good function should read almost like a sentence.

---

# 4. Classes Must Have One Responsibility

A class SHOULD have one primary reason to change.

Do not create giant classes that contain unrelated responsibilities.

Avoid:

```text
CustomerManager
    - database access
    - PDF generation
    - authentication
    - email
    - debt calculation
    - UI formatting
```

Prefer focused components:

```text
CustomerRepository
PdfService
AuthService
DebtCalculator
EmailService
```

Use the Single Responsibility Principle when it improves maintainability.

Do not split classes artificially just to satisfy a line-count rule.

---

# 5. Avoid Duplication

Follow DRY: **Don't Repeat Yourself.**

When the same business rule or logic exists in multiple places, look for a safe abstraction.

Bad:

```text
calculate balance in screen A
calculate balance differently in screen B
calculate balance again in report C
```

Prefer one authoritative implementation:

```text
DebtCalculator.calculateRemainingBalance()
```

However, do NOT create premature abstractions merely because two pieces of code look superficially similar.

Duplication is sometimes safer than a wrong abstraction.

The goal is to eliminate **meaningful duplication**, especially duplicated business rules.

---

# 6. Prefer Simple Code Over Clever Code

Never optimize code for cleverness, compactness, or showing advanced language features.

Prefer code that another developer can understand immediately.

Avoid unnecessary:

- Nested ternaries.
- Deep callback chains.
- Overly clever functional expressions.
- Reflection when a simpler approach exists.
- Abstractions with no meaningful purpose.
- Generic frameworks created for one simple operation.
- Excessive design patterns.
- Premature optimization.

Simple and explicit code is preferred when it communicates intent better.

---

# 7. Comments

Do NOT use comments to compensate for unclear code.

Bad:

```text
// Check if the customer has debt
if (balance > 0) {
```

Prefer:

```text
if (customer.hasOutstandingDebt()) {
```

Comments SHOULD explain **why**, not obvious **what**.

Good reasons for comments include:

- Non-obvious business rules.
- External constraints.
- Security considerations.
- Workarounds for third-party/library behavior.
- Historical reasons that are important for maintaining the code.

Avoid:

- Commenting every line.
- Restating the code.
- Leaving outdated comments.
- Using comments to justify unnecessarily complicated code.

When code can be made self-explanatory, prefer changing the code.

---

# 8. Avoid Magic Numbers and Strings

Do not scatter unexplained literals throughout business logic.

Bad:

```text
if status == 3
if retryCount > 5
if age >= 18
```

Prefer meaningful constants, enums, or domain concepts:

```text
PaymentStatus.Completed
MAX_RETRY_COUNT
LEGAL_AGE
```

The goal is to communicate meaning.

---

# 9. Error Handling

Errors MUST be handled deliberately.

Never silently swallow exceptions.

Avoid:

```text
try {
    saveCustomer()
} catch {
}
```

Do not catch broad exceptions unless there is a legitimate reason.

Error handling should:

- Preserve useful diagnostic information.
- Provide meaningful errors to the appropriate layer.
- Avoid exposing sensitive internal details to users.
- Fail safely.
- Keep business logic understandable.
- Distinguish expected failures from programming bugs.

Do not use exceptions as normal control flow when a clearer design exists.

---

# 10. Null and Invalid State Handling

Avoid designs that make invalid states easy to create.

Be intentional about:

- Null values.
- Missing data.
- Empty collections.
- Invalid identifiers.
- Invalid user input.
- Impossible state combinations.

Use the language/framework's appropriate mechanisms such as:

- Optional types.
- Null-safe operators.
- Validation.
- Result types.
- Domain-specific exceptions.
- Default values where appropriate.

Do not blindly replace every null with another abstraction. Choose the solution that makes the contract clearest.

---

# 11. Tests Are Part of Clean Code

Code is not considered complete merely because it compiles.

Important behavior MUST be testable.

Tests SHOULD be:

- Readable.
- Focused.
- Independent.
- Deterministic.
- Fast when possible.
- Explicit about expected behavior.

Prefer test names such as:

```text
shouldCreateCustomer()
shouldRejectEmptyCustomerName()
shouldCalculateRemainingDebt()
shouldRecordPayment()
shouldNotAllowPaymentGreaterThanDebt()
```

Avoid giant tests that test unrelated behavior.

Tests should communicate the expected behavior of the system.

---

# 12. Refactoring Is Mandatory When Appropriate

Do not preserve poor code merely because it already exists.

When modifying an area of the codebase:

1. Understand the existing behavior.
2. Make the required change.
3. Improve obvious readability problems that are directly related to the change.
4. Keep the scope controlled.
5. Run relevant tests.
6. Ensure behavior has not unintentionally changed.

Refactor safely rather than rewriting working systems unnecessarily.

The preferred development cycle is:

```text
Make it work
    ↓
Make it correct
    ↓
Make it readable
    ↓
Make it maintainable
    ↓
Test it
```

---

# 13. Abstraction

Create abstractions around meaningful concepts, not around arbitrary code fragments.

Good abstractions hide implementation details and expose meaningful behavior.

Prefer:

```text
customer.hasOutstandingDebt()
```

over forcing callers to know:

```text
customer.totalDebt - customer.totalPayments > 0
```

Abstractions should make the system easier to understand.

Avoid abstraction for abstraction's sake.

---

# 14. Encapsulation

Keep implementation details private.

Expose behavior instead of unnecessary internal state.

Prefer:

```text
customer.recordPayment(payment)
```

over allowing every caller to manipulate internal collections and balances directly.

Objects should protect their invariants.

Do not expose mutable internal state unless there is a strong reason.

---

# 15. Separation of Concerns

Keep unrelated concerns separate.

For example:

```text
UI
 ↓
Application/Service Layer
 ↓
Domain Logic
 ↓
Repository/Data Access
 ↓
Database
```

Do not mix:

- UI rendering with database queries.
- Business rules with HTTP details.
- Persistence logic with presentation formatting.
- Authentication logic with unrelated domain calculations.

Use the architecture already established by the project. Do not introduce a new architecture merely for theoretical purity.

---

# 16. SOLID Principles

Apply SOLID where it provides real value.

## S — Single Responsibility

One class should have one primary responsibility and one primary reason to change.

## O — Open/Closed

Design stable abstractions so new behavior can often be added without repeatedly modifying unrelated existing behavior.

Do not interpret this as "never modify existing code."

## L — Liskov Substitution

Subtypes must behave consistently with the contracts expected from their base types.

Do not create inheritance relationships that violate expectations.

## I — Interface Segregation

Prefer focused interfaces over giant interfaces that force implementations to depend on methods they do not need.

## D — Dependency Inversion

High-level business logic should depend on abstractions rather than concrete infrastructure when that dependency matters for testing, flexibility, or architecture.

Do not introduce interfaces everywhere without a reason.

---

# 17. Keep Coupling Low

Changes in one part of the application should not unnecessarily require changes everywhere else.

Avoid:

```text
UI → directly manipulates database
UI → directly implements business rules
Business logic → knows specific UI components
Domain → depends on framework-specific details
```

Prefer clear boundaries.

The agent MUST consider whether a new dependency creates unnecessary coupling.

---

# 18. Keep Cohesion High

Related behavior belongs together.

If a class contains many unrelated operations, it is probably doing too much.

If a function constantly reaches into other objects' internals, reconsider the design.

Good code makes it obvious where a behavior belongs.

---

# 19. Don't Over-Engineer

Clean Code does NOT mean creating:

```text
Factory
AbstractFactory
FactoryProvider
StrategyFactory
RepositoryFactory
```

for a problem that only requires:

```text
createCustomer()
```

Do not add:

- Layers without purpose.
- Interfaces without meaningful substitution.
- Design patterns because they sound professional.
- Generic utilities for one use.
- Configuration systems for fixed values.
- Abstractions for hypothetical future requirements.

Build for the actual requirements while leaving the code easy to evolve.

---

# 20. Boy Scout Rule

When safely working in existing code:

> Leave the code cleaner than you found it.

This does NOT mean rewriting unrelated areas.

Make small, relevant improvements when touching code:

- Better names.
- Smaller functions.
- Removed duplication.
- Cleaner conditions.
- Better error handling.
- Removed dead code.

Keep improvements controlled and avoid scope creep.

---

# 21. Dead Code

Remove code that is genuinely unused when it is safe to do so.

Avoid keeping:

- Unused variables.
- Unreachable branches.
- Obsolete functions.
- Dead imports.
- Commented-out old implementations.
- Duplicate implementations.

Version control already stores history.

Do not keep large blocks of commented-out code "just in case."

---

# 22. Consistency

Follow the project's existing conventions.

Before introducing a new pattern, inspect the surrounding code.

Maintain consistency in:

- Naming.
- File structure.
- Error handling.
- State management.
- API design.
- Testing style.
- Formatting.
- Component structure.
- Architecture.

Clean Code includes consistency because inconsistent code increases cognitive load.

---

# 23. Readability Over Brevity

Do not confuse fewer lines with cleaner code.

Bad:

```text
const x = a ? b ? c : d : e;
```

Potentially better:

```text
const isEligible = checkEligibility(customer);
const discount = calculateDiscount(isEligible);
```

The goal is not minimum characters.

The goal is minimum **mental effort**.

---

# 24. Maintainability Is the Final Metric

When choosing between two valid implementations, prefer the one that makes future changes safer and easier.

Ask:

```text
If a new developer joins tomorrow,
which implementation will they understand faster?
```

Ask:

```text
If the business rule changes next month,
which implementation will require fewer risky changes?
```

Ask:

```text
If this code breaks in production,
which implementation will be easier to debug?
```

These questions should influence architectural and implementation decisions.

---

# 25. Mandatory Pre-Completion Review

Before reporting a coding task as complete, perform a Clean Code review.

Check:

### Naming

- [ ] Variables have meaningful names.
- [ ] Functions clearly describe their behavior.
- [ ] Classes clearly describe their responsibility.
- [ ] No unnecessary abbreviations or vague names.

### Functions

- [ ] Functions are focused.
- [ ] Functions do not contain unrelated responsibilities.
- [ ] Deep nesting has been avoided where practical.
- [ ] Parameter counts are reasonable.
- [ ] Boolean flags are not being used to hide multiple behaviors.

### Classes

- [ ] Classes have clear responsibilities.
- [ ] No obvious god classes.
- [ ] Responsibilities are not unnecessarily mixed.

### Duplication

- [ ] Important business rules are not duplicated.
- [ ] Repeated logic has been considered for extraction.
- [ ] No premature abstraction was introduced.

### Complexity

- [ ] The solution is as simple as reasonably possible.
- [ ] No unnecessary design patterns were added.
- [ ] No clever code was introduced merely to shorten the implementation.

### Errors

- [ ] Errors are handled intentionally.
- [ ] Exceptions are not silently swallowed.
- [ ] User-facing errors are appropriate.
- [ ] Sensitive implementation details are not leaked.

### Tests

- [ ] Relevant behavior is covered by tests where appropriate.
- [ ] Tests are readable.
- [ ] Tests are deterministic.
- [ ] Existing tests still pass.

### Maintainability

- [ ] The implementation follows existing project architecture.
- [ ] The code is easier to understand than before.
- [ ] Future changes should be reasonably localized.
- [ ] No unnecessary scope creep was introduced.

---

# 26. Agent Behavior Rules

The agent MUST:

1. Read existing code before modifying it.
2. Understand the project's architecture before introducing new abstractions.
3. Prefer clear names over clever implementations.
4. Keep functions and classes focused.
5. Avoid duplication of meaningful business logic.
6. Avoid unnecessary complexity.
7. Handle errors explicitly.
8. Write or update tests for meaningful behavior changes.
9. Refactor relevant code when the change exposes obvious maintainability problems.
10. Preserve existing behavior unless the task explicitly requires changing it.
11. Follow established project conventions.
12. Explain important architectural decisions in the final task report.
13. Mention any Clean Code trade-offs that were intentionally made.
14. Never claim code is complete without running the relevant validation available in the project.

The agent MUST NOT:

1. Add abstractions merely to appear architecturally sophisticated.
2. Create giant "Manager", "Utils", or "Helper" classes without a clear responsibility.
3. Duplicate business rules across components.
4. Hide errors silently.
5. Use comments to explain code that should instead be made clearer.
6. Introduce unnecessary design patterns.
7. Rewrite unrelated parts of the project.
8. Sacrifice readability for fewer lines of code.
9. Sacrifice maintainability for short-term convenience when the cost is obvious.
10. Follow Clean Code rules mechanically when doing so would make the actual code worse.

---

# 27. Priority Order

When principles conflict, use this priority:

```text
Correctness
    ↓
Security
    ↓
Maintainability
    ↓
Readability
    ↓
Testability
    ↓
Performance
    ↓
Brevity
```

Performance optimization may move higher when profiling or explicit requirements demonstrate that performance is a real constraint.

Never sacrifice correctness or security merely to make code shorter or prettier.

---

# 28. Final Principle

The agent should constantly remember:

> Clean Code is not about writing code that looks impressive.

> Clean Code is about writing code that another human can understand, trust, test, modify, and extend.

The ultimate objective is:

```text
Less mental effort
        ↓
Clearer code
        ↓
Safer changes
        ↓
Fewer bugs
        ↓
Better software
```

This skill should guide implementation, code review, refactoring, architecture decisions, and technical recommendations throughout the project.
