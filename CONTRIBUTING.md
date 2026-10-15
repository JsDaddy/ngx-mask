# Contributing

## Issues

When submitting an issue, please include a reproducible case that we can actually run. Protractor has a test Angular application available at `http://www.protractortest.org/testapp` which you can use for the reproducible test case. If there's an error, please include the error text.

Please format code and markup in your issue using [github markdown](https://help.github.com/articles/github-flavored-markdown).

## Contributing to Source Code (Pull Requests)

- If your PR changes any behavior or fixes an issue, it should have an associated test.
- Put a regression test in the existing spec file for the behaviour it covers, in a `describe('<behaviour> (#NNNN)')` block: nested in the file's describe when its setup fits, otherwise a top-level describe in that file. Do not add `issue-NNNN.spec.ts` files; create a new spec file only when none fits, named by topic.
- New features should be general and as simple as possible.
- Breaking changes should be avoided if possible.
- All pull requests require review. No PR will be merged without a comment from a team member stating LGTM (Looks good to me).

## Protractor specific rules

- JavaScript style should generally follow the [Google JS style guide](https://google.github.io/styleguide/javascriptguide.xml).
- Document public methods with jsdoc.
- Be consistent with the code around you!

## Pull request titles

Releases are automatic. Do not edit version numbers or `CHANGELOG.md`: the release bot does it from your PR title.

The PR title becomes the commit message on `develop` and the changelog line. It must follow Conventional Commits and the scope is required:

    <type>(<scope>): <subject>

`<type>` is one of `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert`. `<scope>` is the area, e.g. `mask`, `pipe`, `forms`, `demo`, `readme`, `ci`. Use a lowercase subject, no trailing period. A bot checks the title on every PR.

| Title                                                       | Effect on the next release                          |
| ----------------------------------------------------------- | --------------------------------------------------- |
| `feat(scope): ...`                                          | minor (22.x.0)                                      |
| `fix(scope): ...`, `perf(scope): ...`, `revert(scope): ...` | patch (22.x.y)                                      |
| `feat(scope)!: ...` or `fix(scope)!: ...`                   | major, describe the migration in the PR description |
| `docs`, `test`, `refactor`, `build`, `ci`, `chore`, `style` | none                                                |

Only changes under `projects/ngx-mask-lib/` can trigger a release; demo-only changes (`src/`) never do. A library fix or feature must therefore use `fix`/`feat`, not `chore`. Maintainers merge with "Squash and merge"; the PR title is used as is.

## Testing your changes

When you submit a PR, tests will be automatically run on the Continuous Integration environment. If any of your tests fail, review the logs and address the issues before requesting a review.
