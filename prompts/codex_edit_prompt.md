# Equorn Project Codex Edit Prompt

## Project Overview
Equorn is a sophisticated myth-generation tool implemented as a monorepo with multiple packages:
- `@equorn/core`: Core myth generation logic
- `@equorn/web`: Web interface
- `@equorn/cli`: Command-line interface
- `@equorn/templates`: Myth templates

## Codebase Structure
The project follows a modern TypeScript/Node.js architecture with:
- TypeScript for type safety
- Jest for testing
- ESLint for code quality
- Yarn workspaces for package management
- Next.js for the web interface
- Tailwind CSS for styling

## Edit Guidelines
When making edits to the codebase, please follow these guidelines:

1. **Type Safety**
   - Maintain strict TypeScript types
   - Use proper type annotations
   - Avoid any type assertions unless absolutely necessary

2. **Code Style**
   - Follow the existing ESLint configuration
   - Use consistent naming conventions
   - Maintain proper indentation and formatting
   - Add appropriate JSDoc comments for public APIs

3. **Testing**
   - Ensure all new code has corresponding tests
   - Follow the existing test patterns
   - Maintain test coverage

4. **Architecture**
   - Keep the separation of concerns between packages
   - Follow the existing module structure
   - Maintain the monorepo organization

5. **Documentation**
   - Update README files when necessary
   - Document new features and changes
   - Keep API documentation up to date

## Common Edit Patterns

### Adding New Features
1. Identify the appropriate package
2. Create necessary types and interfaces
3. Implement the feature
4. Add tests
5. Update documentation

### Modifying Existing Code
1. Locate the relevant files
2. Understand the current implementation
3. Make changes while maintaining compatibility
4. Update tests if needed
5. Update documentation

### Bug Fixes
1. Identify the root cause
2. Make minimal necessary changes
3. Add regression tests
4. Document the fix

## Package-Specific Guidelines

### Core Package
- Maintain the myth generation logic
- Keep the template system flexible
- Ensure proper error handling
- Maintain type safety

### Web Package
- Follow Next.js best practices
- Maintain responsive design
- Keep UI components reusable
- Follow Tailwind CSS patterns

### CLI Package
- Keep commands intuitive
- Maintain proper error messages
- Follow CLI best practices
- Keep help documentation up to date

### Templates Package
- Maintain template structure
- Keep templates modular
- Document template variables
- Follow naming conventions

## Example Edit Format
When requesting edits, provide:
1. The target file(s)
2. The specific changes needed
3. The context of the changes
4. Any dependencies or related files
5. Expected behavior

Example:
```typescript
// File: packages/core/src/myth-generator.ts
// Context: Adding new myth type support
// Dependencies: types.ts, templates.ts

interface NewMythType {
  // ... type definition
}

export class MythGenerator {
  // ... existing code ...
  
  public generateNewMythType(): NewMythType {
    // ... implementation
  }
}
```

## Important Notes
- Always maintain backward compatibility
- Consider the impact on other packages
- Follow the existing error handling patterns
- Keep the codebase maintainable
- Consider performance implications
- Maintain security best practices 