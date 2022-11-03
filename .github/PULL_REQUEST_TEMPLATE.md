**Description**
A description of the PR, should include a decent explanation as to why this change was needed and a decent explanation as to what this change does

**Review Instructions**
Describe if this ticket needs review and if so, how one may go about it in qa and/or staging environments.
For example, a ticket based on Security Hub, Snyk, or Dependabot may not need review since those services
will generate new warnings if the issue has not been resolved properly. On the other hand, an infrastructure
ticket that results in visible changes to the end-user will definitely require review.
Many tickets will likely be between these two extremes, so some judgement may be required.

**Issue**
A link to a github issue or SEAB- ticket (using that as a prefix)

Please make sure that you've checked the following before submitting your pull request. Thanks!

- [ ] Check that your code compiles by running `npm run build`
- [ ] If this is the first time you're submitting a PR or even if you just need a refresher, consider reviewing our [style guide](https://github.com/dockstore/dockstore/wiki/Dockstore-Frontend-Opinionated-Style-Guide#pr-checklist)
- [ ] Do not bypass Angular sanitization (bypassSecurityTrustHtml, etc.), or justify why you need to do so
- [ ] If displaying markdown, use the `markdown-wrapper` component, which does extra sanitization
- [ ] Do not use cookies, although this may change in the future
- [ ] Run `npm audit` and ensure you are not introducing new vulnerabilities
- [ ] Do due diligence on new 3rd party libraries, checking for CVEs
- [ ] Don't allow user-uploaded images to be served from the Dockstore domain
- [ ] If this PR is for a user-facing feature, create and link a documentation ticket for this feature (usually in the same milestone as the linked issue). Style points if you create a documentation PR directly and link that instead.
