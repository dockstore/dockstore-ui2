
/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */
describe('Dockstore Home', function() {
  require('./helper.js')
	beforeEach(function () {
		cy.visit(String(global.baseUrl))
	})

	it('cy.should - assert that <title> is correct', function() {
		cy.title().should('include', 'Dockstore');
	  // ignoring for now, not working in combination with API display
		//expect(browser.getLocationAbsUrl()).toMatch("/");
	});

  describe('Browse tabs', function() {
	  it('should have tool tab selected', function() {
      cy
        .get("#toolTab")
          .should("exist")
    });
	  it('should not have workflow tab selected', function() {
      cy
        .get("#workflowTab")
          .should("exist")
    });
  });

  describe('Navigation', function() {
    it ('My Tools visible', function() {
      cy
        .get('#myToolsNav')
          .should("visible")
    });
    it ('My Workflows visible', function() {
      cy
        .get('#myWorkflowsNav')
          .should("visible")
    });
  });

  describe('Landing Video', function() {
      it ('video button visible', function() {
        cy
          .get('.btn.youtube')
            .should("visible")
      });
      it ('open and close video', function() {
        cy
          .get('.btn.youtube').click()
          .get('#cboxContent').should("visible")
          .get('#cboxOverlay').should("visible")
          .get('#cboxClose').click()
          .get('#cboxContent').should("not.visible")
      });
  });
})
