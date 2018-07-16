describe('Dockstore tool list page', function () {
  require('./helper.js')
  describe('Select a tool', function () {
    it('Should be able to go to the tools search page', function () {
      cy.visit(String(global.baseUrl) + "/search-containers")
    });
    it('Should display the correct url', function () {
      cy.get('mat-cell')
        .find('a')
        .contains(/\ba\b/)
        .should('have.attr', 'href', '/containers/quay.io/A2/a')
        .should('not.have.attr', 'href', '/containers/quay.io%20A2%20a')
      cy.get('mat-cell')
        .find('a')
        .contains('b3')
        .should('have.attr', 'href', '/containers/quay.io/A2/b3')
        .should('not.have.attr', 'href', '/containers/quay.io%20A2%20b3')
    });
    it('Should have 4 tools', function () {
      cy
        .get('mat-row')
        .should('have.length', 4)
    });
    it('Should be able to go to the quay.io/A2/a tool', function () {
      cy
        .get('mat-cell')
        .find('a')
        .contains(/\ba\b/)
        .first()
        .click()
        .get('#tool-path')
        .should('contain', 'quay.io/A2/a')
    });
  });
})
