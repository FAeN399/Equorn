# Equorn Project Modernization TODO (Godot 4.4.1)

## Outstanding Tasks

### 1. Node Access Modernization
- [ ] Refactor node access to use `%NodeName` where possible for even more idiomatic Godot 4.4.1 code.
- [ ] Audit all scripts for remaining uses of `get_node()` and replace with `$` or `%` syntax as appropriate.

### 2. Automated Testing
- [ ] Expand unit/integration tests for generated Godot projects.
- [ ] Add CLI-level tests for project generation workflows.
- [ ] Ensure all new features and bug fixes are covered by tests.

### 3. Gameplay Testing
- [ ] Perform full playtest and runtime validation in the Godot 4.4.1 editor.
- [ ] Confirm no regressions in guardian abilities, dialogue, and interaction mechanics.
- [ ] Address any errors or warnings encountered during playtesting.

### 4. Documentation Updates
- [ ] Update code examples and documentation to reflect all modernization changes.
- [ ] Add notes and examples for new signal, export, and node access patterns.
- [ ] Document best practices for future contributors.

### 5. Project Maintenance
- [ ] Monitor for new Godot 4.x API changes and update templates as needed.
- [ ] Keep `CHANGELOG.md` and `ROADMAP.md` up to date with progress and plans.

---

## Recently Completed (for reference)
- Modernized all signal connection/emission to Godot 4.4.1 syntax.
- Updated all export vars to use `@export var` with type annotations.
- Fixed all unused parameter warnings (prefixed with `_`).
- Fixed enum/String parameter mismatches.
- Applied all changes to CLI templates and output scripts.
- Ensured Vitest config and code structure supports robust testing and modularity.
