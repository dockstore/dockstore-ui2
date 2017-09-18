describe('Workflow starring', function() {
  require('./helper.js')

  beforeEach(function() {
    cy.visit(String(global.baseUrl) + "/workflows/A/l")
  });

  describe('Select a Workflow', function() {
    it('Workflow can be starred/unstarred', function() {
      cy
        .get('#starringButton')
        .should('not.be.disabled')
      cy
        .get('#starCountButton')
        .should('not.be.disabled')

      cy
        .get('#starringButtonIcon')
        .should("have.class", "glyphicon-star-empty")

      cy
        .get('#starCountButton')
        .should('contain', '0')
        .click()

      cy
        .get('.alert')
        .should('exist')

      cy
        .get('#backButton')
        .should('exist')
        .should('not.be.disabled')
        .click()

      cy
        .get('#starringButton')
        .click()

      cy
        .get('#starringButtonIcon')
        .should("have.class", "glyphicon-star")

      cy
        .get('#starCountButton')
        .should('contain', '1')
        .click()

      cy
        .get('.alert')
        .should('not.exist')



      cy
        .get('#backButton')
        .should('exist')
        .should('not.be.disabled')
        .click()

      cy
        .get('#dropdown-main')
        .click()
      cy
        .get('#dropdown-starred')
        .click()
      cy
        .get('#starringButton')
        .should('exist')
      cy
        .get('#starCountButton')
        .should('exist')

      cy.visit(String(global.baseUrl) + "/workflows/A/l")

      cy
        .get('#starringButton')
        .click()

      cy
        .get('#starringButtonIcon')
        .should("have.class", "glyphicon-star-empty")

      cy
        .get('#starCountButton')
        .should('contain', '0')
        .click()

      cy
        .get('.alert')
        .should('exist')
    });
  });
})
