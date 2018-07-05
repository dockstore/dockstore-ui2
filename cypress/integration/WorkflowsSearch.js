describe('Dockstore workflow search page', function () {
  require('./helper.js')
  describe('Select a workflow', function () {
    it('Should be able to go to the workflows search page', function () {
      cy.visit(String(global.baseUrl) + "/search-workflows")
    });
    it('Should display the correct url', function () {
      cy.get('mat-cell')
        .find('a')
        .contains(/\bl\b/)
        .should('have.attr', 'href', '/workflows/github.com/A/l')
        .should('not.have.attr', 'href', '/workflows/github.com%20A%20l')
    });
    it('Should have 3 workflows', function () {
      cy
        .get('mat-row')
        .should('have.length', 3)
    });
    it('Should be able to go to the github.com/A/l workflow', function () {
      cy
        .get('mat-cell')
        .find('a')
        .contains(/\bl\b/)
        .click()
        .get('#workflow-path')
        .should('contain', 'github.com/A/l')
    });
  });
})
