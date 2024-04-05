<div align="center">
  <img
    src="assets/logo.png"
    alt="Anabolic Codeowners logo"
    width="200"
  />

  <h1>Anabolic Codeowners</h1>

  <p>CODEOWNERS on steroids. Built for monorepos.</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![GitHub Super-Linter](https://github.com/moltinginstar/anabolic-codeowners/actions/workflows/linter.yaml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/moltinginstar/anabolic-codeowners/actions/workflows/ci.yaml/badge.svg)
[![Check dist/](https://github.com/moltinginstar/anabolic-codeowners/actions/workflows/check-dist.yaml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yaml)
[![CodeQL](https://github.com/moltinginstar/anabolic-codeowners/actions/workflows/codeql-analysis.yaml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yaml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

</div>

Anabolic Codeowners enhances GitHub’s CODEOWNERS functionality, enabling random assignment of code reviewers with per-path granularity. It’s perfect for monorepos, ensuring balanced review workload distribution.

## Features

- Randomly select reviewers from the configured pool to evenly distribute the review load
- Assign reviewers to specific paths or files in your repository, mirroring CODEOWNERS syntax for intuitive setup
- Flexibly set the number of reviewers per pull request to maintain balance between thorough review and efficiency

## Usage

### Definition

Create a workflow `.yaml` under `.github/workflows` like this:

```yaml
name: Assign Reviewers

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review

jobs:
  assign-reviewers:
    runs-on: ubuntu-latest
      steps:
        - name: Checkout code
          uses: actions/checkout@v4

        - name: Anabolic Codeowners
          uses: moltinginstar/anabolic-codeowners@main
          with:
            token: ${{ secrets.GITHUB_TOKEN }}
            config: .github/codeowners.yaml # Optional
            num-reviewers: 1 # Optional
```

### Configuration

To use Anabolic Codeowners, you must also create a configuration file and assign users to specific filepaths. By default, this file will be named `.github/codeowners.yaml`, or you can specify a different location in the workflow manifest. Here’s an example `codeowners.yaml` for an Nx-based monorepo:

```yaml
**/*:
  - agile-codehunter
  - atomic-committer

apps/app1-api/**/*:
  - alluring-creator

apps/app1-api/src/app.module.ts:
  - apex-codex

apps/app1-web/**/*:
  - anomaly-catcher
  - aurora-cascade
  - apex-codex

'!apps/app1-api/**/*':
  - agile-codehunter

libs/app1-shared/**/*:
  - agile-codehunter
  - aurora-cascade
```

The last matching rule for a file overrides previous matches. You can use any path specifier supported by [`minimatch`](https://github.com/isaacs/minimatch), including:

- `*` and `**`
- Negative (`!`) patterns
- POSIX character classes (e.g., `[[:alpha:]]`)
- Etc.

## Contributing

Contributions are very welcome! Please submit pull requests or open issues for bugs and feature requests.

## License

Anabolic Codeowners is licensed under the [MIT License](LICENSE).
