describe('Tool starring', function() {
  require('./helper.js')

  beforeEach(function() {
    cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a")
  });

  describe('Select a tool', function() {
    it('Tool can be starred/unstarred', function() {

      cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a")

      cy
        .get('#starringButton')
        .click()

      cy
        .get('#starringButtonIcon')
        .should("have.class", "glyphicon-star")

    });
  });
})
