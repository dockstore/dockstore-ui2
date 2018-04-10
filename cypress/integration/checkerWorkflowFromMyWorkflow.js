describe('Checker workflow test from my-workflows', function() {
    require('./helper.js')

    beforeEach(function() {
        // Visit my-workflows page
        cy.visit(String(global.baseUrl) + "/my-workflows")
    });


    describe('Should be able to register and publish a checker workflow from a workflow', function() {
        it('visit a tool and have the correct buttons and be able to register a checker workflow', function() {
            cy
            .get('accordion')
            .get('.panel')
            .children(':nth-child(2)')
            .contains('a', 'l')
            .click()

            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('be.visible').click()
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy
                .get('#checkerWorkflowPath')
                .type('/Dockstore.cwl')

            cy
                .get('#checkerWorkflowTestParameterFilePath')
                .type('/test.json')

            cy.get('#submitButton').click()
        });
        it('visit the workflow and its checker workflow and have the correct buttons', function() {
            cy
                .get('accordion')
                .get('.panel')
                .children(':nth-child(2)')
                .contains('a', 'l')
                .click()

            // In the parent workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // In the checker workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l/_cwl_checker')
            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy.get('#viewParentEntryButton').should('be.visible').click()

            // In the parent workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A/l')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.get('#viewCheckerWorkflowButton').should('visible')
        })
        it('visit the workflow and have its publish/unpublish reflected in the checker workflow', function() {
            cy
                .get('accordion')
                .get('.panel')
                .children(':nth-child(2)')
                .contains('a', 'l')
                .click()

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
