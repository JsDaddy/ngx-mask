# Contributing

## Issues

When submitting an issue, please include a reproducible case that we can actually run. Protractor has a test Angular application available at `http://www.protractortest.org/testapp` which you can use for the reproducible test case. If there's an error, please include the error text.

Please format code and markup in your issue using [github markdown](https://help.github.com/articles/github-flavored-markdown).

## Contributing to Source Code (Pull Requests)

* If your PR changes any behavior or fixes an issue, it should have an associated test.
* New features should be general and as simple as possible.
* Breaking changes should be avoided if possible.
* All pull requests require review. No PR will be merged without a comment from a team member stating LGTM (Looks good to me).

## Protractor specific rules

* JavaScript style should generally follow the [Google JS style guide](https://google.github.io/styleguide/javascriptguide.xml).
* Document public methods with jsdoc.
* Be consistent with the code around you!

## Commit Messages

Please write meaningful commit messages - they are used to generate the changelog, so the commit message should tell a user everything they need to know about a commit. Protractor follows AngularJS's [commit message format](https://docs.google.com/a/google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.z8a3t6ehl060).

In summary, this style is

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>

Where `<type>` is one of [feat, fix, docs, refactor, test, chore, deps] and
`<scope>` is a quick descriptor of the location of the change, such as cli, clientSideScripts, element.

## Testing your changes

When you submit a PR, tests will also be run on the Continuous Integration environment
through Travis. If your tests fail on Travis, take a look at the logs.
