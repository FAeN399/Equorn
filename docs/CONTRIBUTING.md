# Contributing to Equorn

First off, thank you for considering contributing to Equorn! It's people like you that make Equorn such a great tool for storytellers and world-builders.

## Getting Started

### Prerequisites

- Node.js ≥ 20 LTS
- pnpm ≥ 10
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/equorn.git
   cd equorn
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Workflow

### Monorepo Structure

Equorn uses a monorepo structure with pnpm workspaces:

- `packages/core`: The core engine
- `packages/cli`: Command-line interface
- `packages/web`: Web dashboard
- `packages/templates`: Seed templates

### Running Tests

```bash
# Run unit tests
pnpm test

# Run end-to-end tests
pnpm test:e2e
```

### Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Check code style
pnpm lint

# Fix code style issues
pnpm lint:fix
```

## Making Changes

1. Make your changes and add tests for new functionality
2. Run the tests to make sure everything passes
3. Update documentation if needed
4. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) format:
   ```
   feat: add new guardian template
   fix: resolve issue with web export
   docs: improve CLI documentation
   ```

## Pull Request Process

1. Push your changes to your fork
2. Submit a pull request to the main repository
3. Fill out the PR template completely
4. Sign the Contributor License Agreement (CLA)
5. Wait for review and address any feedback

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Questions?

If you have questions about the contribution process, feel free to:

- Open an issue with the tag "question"
- Join our Discord community
- Reach out to the maintainers

Thank you for your contributions!

---

*"Grow the code, guard the myth."*
