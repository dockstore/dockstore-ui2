
describe('Dockstore my workflows', function() {
  require('./helper.js')

	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/my-workflows")
  });

 describe('Look at an invalid workflow', function() {
    it('Invalid workflow should not be publishable', function() {
      cy
        .get('#publishButton')
        .should('be.disabled')
      cy
        .get('#refreshButton')
        .should('not.be.disabled')
    });

    it('Only Info and Labels tab should be enabled', function() {
      cy
        .get('#infoTab')
        .should('have.class', 'active')
        .and('not.have.class', 'disabled')
      cy
        .get('#labelsTab')
        .should('not.have.class', 'disabled')
      cy
        .get('#versionsTab')
        .should('have.class', 'disabled')
      cy
        .get('#filesTab')
        .should('have.class', 'disabled')
      cy
        .get('#toolsTab')
        .should('have.class', 'disabled')
      cy
        .get('#dagTab')
        .should('have.class', 'disabled')
    });
  });

  describe('Look at a published workflow', function() {
    it('Look at each tab', function(){
      cy
        .get('.panel-group')
          .children(':nth-child(1)')
          .children(':nth-child(2)')
          .children(':nth-child(1)')
          .children(':nth-child(13)')
          .find('a')
          .first()
          .click()
      cy
        .get('#infoTab')
        .should('have.class', 'active')
        .and('not.have.class', 'disabled')
      cy
        .get('#labelsTab')
        .should('not.have.class', 'disabled')
      cy
        .get('#versionsTab')
        .should('not.have.class', 'disabled')
      cy
        .get('#filesTab')
        .should('not.have.class', 'disabled')
      cy
        .get('#toolsTab')
        .should('not.have.class', 'disabled')
      cy
        .get('#dagTab')
        .should('not.have.class', 'disabled')

      cy
        .get('#publishButton')
        .should('contain', 'Unpublish')
        .click()
        .should('contain', 'Publish')
        .click()
        .should('contain', 'Unpublish')
    });
  });
})
