# .github/workflows/ci.yml
#
# ──────────────────────────────────────────────────────────────
#  Equorn – CI / CD Pipeline (GitHub Actions)
#  ------------------------------------------------------------
#  • Runs lint, type-check, unit + e2e tests on every PR / push
#  • Tests on Node 18 & 20 to catch version regressions
#  • Publishes a multi-arch Docker image to GHCR when a tag
#    matching v*.*.* is pushed (semantic release)
# ──────────────────────────────────────────────────────────────

name: CI

on:
  # Validate every push & PR targeting main
  push:
    branches: [ main ]
    tags:    [ 'v*.*.*' ]   # trigger release job on version tag
  pull_request:
    branches: [ main ]

jobs:
  # ──────────────────────────────────────────
  # 1) Build, Lint, Test matrix
  # ──────────────────────────────────────────
  build-test:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    strategy:
      matrix:
        node-version: [ 18.x, 20.x ]  # keep compatibility
      fail-fast: false

    steps:
      - uses: actions/checkout@v4

      - name: Use Node ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'                # built-in cache for ~/.pnpm-store

      - name: Enable & pin pnpm
        run: |
          corepack enable
          corepack prepare pnpm@8.15.5 --activate

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint + Type-check
        run: |
          pnpm lint
          pnpm typecheck

      - name: Run unit & e2e tests (with coverage)
        run: pnpm test -- --coverage

      - name: Upload coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: coverage-${{ matrix.node-version }}
          path: coverage/
          retention-days: 7

  # ──────────────────────────────────────────
  # 2) Release – build + push Docker image
  #    (executes only on version tags)
  # ──────────────────────────────────────────
  release:
    if: startsWith(github.ref, 'refs/tags/v')
    needs: build-test         # run only if tests passed
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      # Multi-arch build tooling
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3

      # Login to GitHub Container Registry (or Docker Hub—adjust as needed)
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Build & push image tagged with the release version
      - name: Build & push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          platforms: linux/amd64,linux/arm64
          tags: ghcr.io/${{ github.repository }}:${{ github.ref_name }}

      # (Optional) create a GitHub Release & attach CHANGELOG
      - name: Draft GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ github.ref_name }}
          generate_release_notes: true
