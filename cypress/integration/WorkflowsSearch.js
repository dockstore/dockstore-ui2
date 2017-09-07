describe('Dockstore workflow search page', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/search-workflows")
  });

   describe('Select a workflow', function() {
     it('Should have one workflow (and a hidden row)', function() {
       cy
         .get('tbody')
         .children('tr')
         .should('have.length', 2)
     });

     it('Select test_workflow_cwl', function() {
       cy
         .get('tbody')
         .children('tr')
         .first()
         .find('a')
         .first()
         .click()
         .get('#workflow-path')
         .should('contain', 'A/l')
     });
   });
})
