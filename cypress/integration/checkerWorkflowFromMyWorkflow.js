describe('Checker workflow test from my-workflows', function() {
    require('./helper.js')

    beforeEach(function() {
        // Visit my-workflows page
        cy.visit(String(global.baseUrl) + "/my-workflows")
    });

    /**
     * This specifically gets the 'l' workflow, not something containing the 'l', but exactly 'l'
     */
    function getWorkflow() {
        cy.contains('github.com/A')
            .first()
            .parentsUntil('accordion-group')
            .contains('div .no-wrap', /\l\b/)
            .should('be.visible').click()
    }

    describe('Should be able to register and publish a checker workflow from a workflow', function() {
      it('visit a tool and have the correct buttons and be able to register a checker workflow', function() {
        cy.server()
        getWorkflow();
        cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
        cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
        cy.get('#viewParentEntryButton').should('not.be.visible')
        cy.get('#addCheckerWorkflowButton').should('be.visible')
        cy.goToTab('Launch')
        cy.get('#launchCheckerWorkflow').should('not.be.visible')
        cy.goToTab('Info')
        cy.get('#addCheckerWorkflowButton').should('be.visible').click()
        cy
          .get('#checkerWorkflowPath')
          .type('/Dockstore.cwl')
        cy
          .get('#checkerWorkflowTestParameterFilePath')
          .type('/test.json')
        cy.fixture('refreshedChecker').then((json) => {
          cy.route({
            method: "GET",
            url: '/workflows/*/refresh',
            response: json
          })
          cy.get('#submitButton').click()
        })

        // Actions should be possible right after registering checker workflow
        cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
        cy.get('#viewCheckerWorkflowButton').should('be.visible')
        cy.get('#viewParentEntryButton').should('not.be.visible')
        cy.get('#viewCheckerWorkflowButton').should('not.be.disabled').click()
        cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l/_cwl_checker')
        cy.contains('github.com/A/l/_cwl_checker')
        cy.get('#addCheckerWorkflowButton').should('not.be.visible')
        cy.get('#viewParentEntryButton').should('be.visible').click()
        cy.get('#workflow-path').contains('github.com/A/l')
        cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
        cy.get('#viewParentEntryButton').should('not.be.visible')
        cy.get('#viewCheckerWorkflowButton').should('be.visible')
      });
        it('visit the workflow and its checker workflow and have the correct buttons', function() {
            getWorkflow();
            // In the parent workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.goToTab('Info')
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // In the checker workflow right now

            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l/_cwl_checker')
            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy.goToTab('Info')
            cy.get('#viewParentEntryButton').should('be.visible').click()

            // In the parent workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.goToTab('Info')
            cy.get('#viewCheckerWorkflowButton').should('visible')
        })
        it('visit the workflow and have its publish/unpublish reflected in the checker workflow', function() {
            // The url should automatically change to include the workflow full path
            getWorkflow();
            // The url should automatically change to include the workflow full path
            // In the parent tool right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
            cy.get('#publishButton').should('be.visible').should('contain', 'Unpublish').click()
            // Need to wait because switching to another entry too fast will cause the new entry's checker workflow to be updated instead
            cy.wait(500)
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // In the checker workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l/_cwl_checker')
            cy.get('#publishButton').should('be.visible').should('contain', 'Publish')
            cy.get('#viewParentEntryButton').should('be.visible').click()

            // In the parent tool right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
            cy.get('#publishButton').should('be.visible').should('contain', 'Publish').click()
            // Need to wait because switching to another entry too fast will cause the new entry's checker workflow to be updated instead
            cy.wait(500)
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // in the checker workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l/_cwl_checker')
            cy.get('#publishButton').should('be.visible').should('contain', 'Unpublish')
        })
    });
});
