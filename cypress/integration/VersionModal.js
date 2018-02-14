describe('Public Version Modal', function() {
    require('./helper.js')
    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut")
        cy
            .get('tab')
            .should('have.length', 7)
    });

    it('Change tab to versions', function() {
        cy
            .get('.nav-link')
            .contains('Versions')
            .parent()
            .click()

        cy
            .contains("View")
            .click()
        cy.get('form')
        cy.get('#dockerPullCommand').should('be.visible').should('have.value','docker pull quay.io/garyluu/dockstore-cgpmap:3.0.0-rc8')
    });
})
