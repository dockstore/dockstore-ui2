describe('Dockstore workflow search page', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/search-workflows")
  });

   describe('Select a workflow', function() {
    it('Should display the correct url', function() {
      cy.get('tbody')
      .children('tr:nth-child(2)')
      .find('a')
      .contains('l')
      .should('have.attr', 'href', '/workflows/github.com/A/l')
      .should('not.have.attr', 'href', '/workflows/github.com%20A%20l')
    });
    
     it('Should have 3 workflow (and a hidden row)', function() {
       cy
         .get('tbody')
         .children('tr')
         .should('have.length', 3)
     });

     it('Select test_workflow_cwl', function() {
       cy
         .get('tbody')
         .children('tr:nth-child(2)')
         .first()
         .find('a')
         .first()
         .click()
         .get('#workflow-path')
         .should('contain', 'github.com/A/l')
     });
   });
})
