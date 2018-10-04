global.baseUrl = "http://localhost:4200";
beforeEach(function () {
  // Login by adding user obj and token to local storage
  localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"user_A\", \"isAdmin\": \"false\", \"name\": \"user_A\"}')
  localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken')

  cy.viewport('macbook-15')
});

Cypress.Commands.add('goToTab', (tabName) => {
  cy
    .get('.nav-link')
    .contains(tabName)
    .parent()
    .click()
})

Cypress.Commands.add('goToUnexpandedSidebarEntry', (organization, repo) => {
  // This is needed because of a possible defect in the implementation.
  // All expansion panels are shown before any of them are expanded (after some logic of choosing which to expanded).
  // If the user expands a panel before the above happens, their choice gets overwritten
  cy.get('.mat-expanded')
  cy.contains(organization)
    .click()
  // Can't seem to select the mat-expansion-panel for some reason without triple parent
  cy.contains(organization)
    .parent()
    .parent()
    .parent()
    .contains('div .no-wrap', repo)
    .should('be.visible').click()
})
