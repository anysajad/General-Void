# Codebase Health & Technical Debt Analysis Skill

## Purpose

This skill is a mandatory post-task codebase analysis process.

The agent MUST use this skill **after every completed development task** before considering the task fully finished.

The purpose is to continuously inspect the entire codebase and identify:

1. Dead code
2. Duplicate logic
3. Unused UI components
4. Overly complex implementations
5. Legacy code
6. Redundant database queries or API calls
7. Abandoned or disconnected files
8. Technical-debt reduction opportunities

The goal is to keep the project clean, maintainable, scalable, and free from unnecessary code accumulation as development continues.

---

# When This Skill Must Run

Run this skill:

* **After every completed task**
* After implementing a feature
* After fixing a bug
* After refactoring
* After modifying architecture
* After adding or removing routes
* After adding or modifying database/API functionality
* After adding UI components
* After dependency changes

This analysis is part of task completion.

The agent MUST NOT skip it simply because the task was small.

---

# Core Rules

## Rule 1 — Analyze the Entire Codebase

Do not analyze only the files changed in the current task.

The agent must consider the entire application and its relationships.

Inspect:

* Source files
* Components
* Hooks
* Utilities
* Services
* Repositories
* Routes
* Pages
* API integrations
* Database access
* Authentication
* State management
* Context/providers
* Configuration
* Tests
* Assets
* Styles
* Dependencies
* Build configuration
* Environment configuration
* Firebase/backend code when present

The objective is to understand whether newly changed code has affected the usefulness or connectivity of existing code.

---

# 1. Dead Code Detection

Look for code that appears to have no active purpose.

Check for:

* Unused functions
* Unused classes
* Unused hooks
* Unused components
* Unused utilities
* Unused variables
* Unused constants
* Unused types/interfaces
* Unused imports
* Unused exports
* Unused files
* Unused routes
* Unused API endpoints
* Unused database functions
* Unused services
* Unused configuration
* Unused feature flags
* Unused dependencies
* Unreachable code
* Commented-out production code
* Obsolete fallback implementations

For every suspected dead-code item, determine whether it is actually unused before recommending removal.

Do NOT remove code merely because it appears unused from a single file.

Check:

* Direct imports
* Re-exports
* Dynamic imports
* Route registration
* Runtime references
* Configuration references
* String-based references
* Test usage
* Build tooling
* Framework conventions

---

# 2. Duplicate Logic Detection

Search for repeated logic that should potentially be consolidated.

Look for:

* Repeated validation
* Repeated formatting
* Repeated database operations
* Repeated API calls
* Repeated authentication checks
* Repeated permission checks
* Repeated error handling
* Repeated loading-state handling
* Repeated empty-state handling
* Repeated transformation logic
* Repeated normalization logic
* Repeated date/number/currency formatting
* Repeated UI behavior
* Repeated Firestore queries
* Repeated business rules
* Similar hooks
* Similar components
* Similar utility functions

Distinguish between:

### Intentional duplication

Some duplication may improve readability or maintainability.

Do not automatically consolidate every similar piece of code.

### Accidental duplication

If multiple parts of the application implement the same business rule or behavior independently, identify it as technical debt.

Recommend a shared abstraction when appropriate.

---

# 3. Unused UI Components

Inspect the component system specifically.

Identify:

* Components with no consumers
* Components that were replaced by newer components
* Duplicate components
* Components that are only partially used
* Components that contain obsolete variants
* Components that are no longer reachable through the UI
* Components whose functionality has moved elsewhere
* Components created for an abandoned feature

Check component usage across:

* Pages
* Routes
* Other components
* Dynamic imports
* Modals/dialogs
* Tests
* Story/demo files
* Shared layouts

Do not delete a component solely because it is not directly imported by a page.

Check the complete dependency graph first.

---

# 4. Overly Complex Implementations

Look for code that is more complicated than necessary.

Identify:

* Excessively large functions
* Excessively large components
* Deeply nested conditionals
* Repeated branching
* Unnecessary abstractions
* Over-engineered hooks
* Unnecessary state
* State that can be derived
* Excessive prop drilling
* Complicated data transformations
* Multiple layers doing the same work
* Complex effects
* Unnecessary `useEffect` usage
* Difficult-to-follow async flows
* Repeated try/catch structures
* Complex conditional rendering
* Overly complicated database logic
* Abstractions that provide little value

For each case, explain:

* Why it is complex
* What makes it difficult to maintain
* Whether simplification is worthwhile
* A safer possible approach

Do not refactor complex code automatically unless the current task requires it or the change is clearly safe.

---

# 5. Legacy Code Detection

Search for code that appears to belong to an older architecture or implementation.

Examples:

* Old implementations replaced by newer ones
* Deprecated APIs
* Previous routing systems
* Old authentication logic
* Old database access patterns
* Old UI components
* Migration leftovers
* Temporary compatibility layers
* Deprecated configuration
* Old feature flags
* Previous naming conventions
* Obsolete comments
* TODOs referring to completed work
* Old test helpers
* Unused migration code

Determine whether the legacy code is still required before recommending removal.

---

# 6. Redundant Database Queries / API Calls

Inspect all database and API access.

Look for:

* The same query executed multiple times unnecessarily
* Duplicate requests triggered by the same user action
* Requests caused by unnecessary re-renders
* Requests triggered repeatedly by effects
* Fetching data that is already available locally
* Fetching the same data in parent and child components
* Queries whose results are never used
* Queries that retrieve more data than necessary
* Repeated subscriptions
* Duplicate listeners
* API calls that could be combined
* Sequential requests that could safely be avoided or optimized
* Database reads caused by unnecessary UI state changes

Pay particular attention to:

* Firestore reads
* Firestore listeners
* Authentication-related requests
* API calls
* Search queries
* Dashboard statistics
* Customer/person data
* Transaction data

Do not optimize by introducing unnecessary caching or architectural complexity.

The objective is to eliminate **genuinely redundant work**, not to optimize everything prematurely.

---

# 7. Abandoned or Disconnected Files

Identify files that appear disconnected from the application.

Examples:

* Files with no imports or consumers
* Pages with no route
* Components with no usage
* Services with no callers
* Utilities with no callers
* Hooks with no consumers
* Old test files
* Old configuration files
* Duplicate files
* Temporary files
* Backup files
* Experimental implementations
* Files from removed features
* Files referencing obsolete architecture

For every suspected abandoned file, verify whether it is referenced indirectly before recommending deletion.

---

# 8. Technical Debt Opportunities

Identify areas that could become problems as the application grows.

Consider:

### Architecture

* Poor separation of concerns
* Circular dependencies
* Tight coupling
* Incorrect layer responsibilities
* Repeated business logic
* Inconsistent patterns

### Maintainability

* Inconsistent naming
* Inconsistent error handling
* Inconsistent state management
* Large files
* Large functions
* Difficult-to-test code
* Hard-coded values

### Scalability

* Database access patterns that may become expensive
* Inefficient queries
* Missing indexes
* Excessive reads
* Components that will become difficult to extend
* Architecture that does not scale with additional features

### Reliability

* Missing error handling
* Missing loading states
* Missing empty states
* Race conditions
* Unsafe async operations
* Fragile assumptions

### Testing

* Important logic without tests
* Duplicated test helpers
* Tests coupled to implementation details
* Missing regression coverage

### Dependencies

* Unused packages
* Duplicate libraries solving the same problem
* Outdated architectural dependencies
* Dependencies used for functionality that could be removed

---

# Analysis Method

After completing a task, perform the following process.

## Step 1 — Inspect the Repository

Review the repository structure.

Identify:

* Application entry points
* Major directories
* Architecture
* Routing
* Components
* Services
* Data layer
* Tests
* Configuration
* Dependencies

---

## Step 2 — Build a Dependency Understanding

Determine how important parts of the application connect.

At minimum understand:

```text
Entry Point
    ↓
Application Shell
    ↓
Routes
    ↓
Pages
    ↓
Components
    ↓
Hooks / State
    ↓
Services / Repositories
    ↓
Database / APIs
```

Also inspect shared dependencies such as:

```text
Context
Providers
Utilities
Types
Configuration
Authentication
```

---

## Step 3 — Search for Usage

For suspicious code, search the entire repository.

Do not rely only on IDE indicators.

Check:

* Imports
* Exports
* Re-exports
* Dynamic imports
* Routes
* Configuration
* Tests
* String references
* Runtime registration

---

## Step 4 — Validate Before Removing

Before recommending removal, answer:

> "Can this code be safely removed without breaking existing functionality?"

If the answer is uncertain, mark it as:

**Needs verification**

Do not make destructive changes based on assumptions.

---

# Classification

Every finding should receive one severity/category.

### CRITICAL

Potentially harmful architectural or performance issue.

### HIGH

Clear dead code, serious duplication, redundant requests, or significant technical debt.

### MEDIUM

Meaningful maintainability or architectural improvement.

### LOW

Minor cleanup or future improvement.

### INFORMATIONAL

Observation that does not currently require action.

---

# Do Not Over-Refactor

This skill is primarily an **analysis skill**.

The agent should NOT automatically perform large cleanup operations after every task.

Do not:

* Delete large groups of files without verification
* Rewrite architecture unnecessarily
* Replace working implementations just because another approach is cleaner
* Introduce abstractions solely to eliminate a few duplicated lines
* Change behavior while performing cleanup
* Break existing functionality
* Perform unrelated refactors

Prefer:

> Identify → Verify → Report → Prioritize → Refactor intentionally

If a cleanup item is obviously safe and directly related to the completed task, it may be fixed immediately.

Otherwise, report it for a future task.

---

# Regression Protection

The most important rule:

## Existing functionality MUST NOT be broken.

Before considering the task complete:

1. Run the project's available tests.
2. Run type checking if available.
3. Run linting if available.
4. Run the production build if available.
5. Verify that the changes did not introduce regressions.

If cleanup changes were made, verify them separately.

If a cleanup cannot be safely verified, do not perform it.

---

# Required Post-Task Report

After every task, provide a section named:

# Codebase Health Analysis

The report must contain:

## 1. Dead Code

List findings.

If none:

```text
No confirmed dead code found.
```

---

## 2. Duplicate Logic

List findings.

If none:

```text
No significant duplicate logic found.
```

---

## 3. Unused UI Components

List findings.

If none:

```text
No unused UI components identified.
```

---

## 4. Overly Complex Code

List findings.

If none:

```text
No significant unnecessary complexity identified.
```

---

## 5. Legacy Code

List findings.

If none:

```text
No confirmed legacy code requiring removal.
```

---

## 6. Redundant Database/API Operations

List findings.

If none:

```text
No redundant database queries or API calls identified.
```

---

## 7. Abandoned/Disconnected Files

List findings.

If none:

```text
No abandoned or disconnected files identified.
```

---

## 8. Technical Debt

List the most important technical-debt opportunities.

Prioritize them.

---

# Finding Format

Use this format for each finding:

```text
[SEVERITY] Finding

Location:
path/to/file.ts

Issue:
Describe the problem.

Evidence:
Explain why the code appears unused, duplicated, redundant, disconnected, or unnecessarily complex.

Impact:
Explain the maintenance, performance, scalability, or reliability impact.

Recommendation:
Explain the recommended solution.

Action:
- Fixed now
- Recommended for future task
- Needs verification
- No action required
```

---

# Summary

End every analysis with:

```text
## Codebase Health Summary

Confirmed issues:
- X

Potential issues:
- X

Safe cleanups performed:
- X

Future technical-debt items:
- X

Overall status:
HEALTHY / NEEDS ATTENTION / HIGH TECHNICAL DEBT
```

---

# Important Constraint

This skill must be applied **after every task**, but the agent must remain conservative.

The purpose is not to constantly rewrite the project.

The purpose is to ensure that every new task leaves the codebase in a better-understood and maintainable state.

Always prioritize:

1. Existing functionality
2. Correctness
3. Security
4. Data integrity
5. Maintainability
6. Performance
7. Cleanup

Never sacrifice existing functionality merely to make the code "cleaner."
