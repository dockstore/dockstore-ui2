
describe('Dockstore tool search page', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/search-containers")
  });

  describe('Select a tool', function() {
    it('Should display the correct url', function() {
      cy.get('tbody')
      .children('tr')
      .find('a')
      .contains('a')
      .should('have.attr', 'href', '/containers/quay.io/A2/a')
      .should('not.have.attr', 'href', '/containers/quay.io%20A2%20a')
      cy.get('tbody')
      .children('tr')
      .find('a')
      .contains('b3')
      .should('have.attr', 'href', '/containers/quay.io/A2/b3')
      .should('not.have.attr', 'href', '/containers/quay.io%20A2%20b3')
    });
    
    it('Should have 4 tools', function() {
      cy
        .get('tbody')
        .children('tr')
        .should('have.length', 4)
    });

    it('Select dockstore-tool-imports', function() {
      cy
        .get('tbody')
        .children('tr')
        .first()
        .find('a')
        .first()
        .click()
        .get('#tool-path')
        .should('contain', 'quay.io/A2/a')
    });
  });
})
