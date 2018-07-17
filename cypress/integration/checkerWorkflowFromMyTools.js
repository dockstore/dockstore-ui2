describe('Checker workflow test from my-tools', function() {
    require('./helper.js')

    beforeEach(function() {
        // Visit my-tools page
        cy.visit(String(global.baseUrl) + "/my-tools")
    });

    function goToB3() {
        cy.contains('quay.io/A2')
            .parentsUntil('accordion-group')
            .contains('div .no-wrap', /\bb3\b/)
            .should('be.visible').click()
    }

    describe('Should be able to register and publish a checker workflow from a tool', function() {
        it('visit a tool and have the correct buttons and be able to register a checker workflow', function() {
            goToB3();

            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('be.visible').click()

            cy
              .get('#checkerWorkflowPath')
              .type('/Dockstore.cwl')

            cy
              .get('#checkerWorkflowTestParameterFilePath')
              .type('/test.json')

            cy.get('#submitButton').click()
        });
        it('visit the tool and its checker workflow and have the correct buttons', function() {
            goToB3();
            // In the parent tool right now
            // Didn't change the tool path upon entry or select
            // cy.url().should('eq', 'http://localhost:4200/my-tools/quay.io/A2/b3')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.goToTab('Info')
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // In the checker workflow right now
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A2/b3/_cwl_checker')
            cy.get('#viewCheckerWorkflowButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.wait(3000)
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('not.be.visible')
            cy.goToTab('Info')
            cy.get('#viewParentEntryButton').should('be.visible').click()

            // In the parent tool right now
            cy.url().should('eq', String(global.baseUrl) + '/my-tools/quay.io/A2/b3')
            cy.get('#viewParentEntryButton').should('not.be.visible')
            cy.get('#addCheckerWorkflowButton').should('not.be.visible')
            cy.goToTab('Launch')
            cy.get('#launchCheckerWorkflow').should('be.visible')
            cy.goToTab('Info')
            cy.get('#viewCheckerWorkflowButton').should('visible')
        })
        it('visit the tool and have its publish/unpublish reflected in the checker workflow', function() {
            goToB3();
            // In the parent tool right now
            // Didn't change the tool path upon entry or select
            // cy.url().should('eq', String(global.baseUrl) + '/my-tools/quay.io/A2/b3')
            cy.get('#publishToolButton').should('be.visible').should('contain', 'Unpublish').click()
            cy.get('#publishToolButton').should('be.visible').should('contain', 'Publish')
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // In the checker workflow right now
            cy.get('#workflow-path').should('contain', '_checker')
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A2/b3/_cwl_checker')
            cy.get('#publishButton').should('be.visible').should('contain', 'Publish')
            cy.get('#viewParentEntryButton').should('be.visible').click()

            // In the parent tool right now
            cy.get('#tool-path').should('not.contain', '_checker')
            cy.url().should('eq', String(global.baseUrl) + '/my-tools/quay.io/A2/b3')
            cy.get('#publishToolButton').should('be.visible').should('contain', 'Publish').click()
            cy.get('#publishToolButton').should('be.visible').should('contain', 'Unpublish')
            cy.get('#viewCheckerWorkflowButton').should('visible').click()

            // in the checker workflow right now
            cy.get('#workflow-path').should('contain', '_checker')
            cy.url().should('eq', String(global.baseUrl) + '/my-workflows/github.com/A2/b3/_cwl_checker')
            cy.get('#publishButton').should('be.visible').should('contain', 'Unpublish')
        })
    });
});
