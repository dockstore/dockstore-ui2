
describe('Dockstore tool search page', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/search-containers")
  });

  describe('Select a tool', function() {
    it('Should have three tools (and a hidden row)', function() {
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
        .should('contain', 'quay.io/A2/a ')
    });
  });
})
