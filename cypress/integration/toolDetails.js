describe('Variations of URL', function() {
  require('./helper.js')
  it('Should redirect to canonical url (encoding)', function() {
    cy.visit(String(global.baseUrl) + "/containers/quay.io%2FA2%2Fa")
    cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=info')
  });
  it('Should redirect to canonical url (tools)', function() {
    cy.visit(String(global.baseUrl) + "/tools/quay.io/A2/a")
    cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=info')
  });
  it('Should redirect to canonical url (encoding + tools)', function() {
    cy.visit(String(global.baseUrl) + "/tools/quay.io%2FA2%2Fa")
    cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=info')
  });
  it('Should redirect to canonical url (version)', function() {
    cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a:latest")
    cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=info')
  });
  it('Should redirect to canonical url (tab)', function() {
    cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a?tab=files")
    cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=files')
  });
  it('Should redirect to canonical url (tab + version)', function() {
    cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a:latest?tab=files")
    cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=files')
  });
  it('Should redirect to canonical url (tools + encoding + tab + version)', function() {
    cy.visit(String(global.baseUrl) + "/tools/quay.io%2FA2%2Fa:latest?tab=files")
    cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=files')
  });
});

describe('Dockstore Tool Details of quay.io/A2/a', function() {
    require('./helper.js')
    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a")
        cy
            .get('tab')
            .should('have.length', 7)
        cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=info')
    });

    it('Change tab to launch', function() {
        cy.goToTab('Launch')
        cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=launch')
    });

    it('Change tab to versions', function() {
        cy.goToTab('Versions')
        cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=versions')
    });

    describe('Change tab to files', function() {
        beforeEach(function() {
            cy.goToTab('Files')
            cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/a:latest?tab=files')
        });

        it('Should have Dockerfile tab selected', function() {
            cy
                .get('.nav-link')
                .contains('Dockerfile')
                .parent()
                .should("have.class", "active")

            it('Should have content in file viewer', function() {
                cy
                    .get(".ace_content")
                    .should("be.visible")
            });
        });

        describe('Change tab to Descriptor files', function() {
            beforeEach(function() {
                cy.goToTab('Descriptor Files')
            });

            it('Should have content in file viewer', function() {
                cy
                    .get(".ace_content")
                    .should("be.visible")
            });
        });

        describe('Change tab to Test Parameters', function() {
            beforeEach(function() {
                cy.goToTab('Test Parameter Files')
            });

            it('Should not have content in file viewer', function() {
                cy
                    .get(".ace_content")
                    .should("not.be.visible")
                cy
                    .contains('A Test Parameter File associated with this Docker container, descriptor type and version could not be found.')
            });
        });
    });
})

describe('Dockstore Tool Details of quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut', function() {
    require('./helper.js')
    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut")
        cy
            .get('tab')
            .should('have.length', 7)
    });


    describe('Change tab to files', function() {
        beforeEach(function() {
            cy.goToTab('Files')
        });

        it('Should have Dockerfile tab selected', function() {
            cy
                .get('.nav-link')
                .contains('Dockerfile')
                .parent()
                .should("have.class", "active")

            it('Should have content in file viewer', function() {
                cy
                    .get(".ace_content")
                    .should("be.visible")
            });
        });

        describe('Change tab to Descriptor files', function() {
            beforeEach(function() {
                cy.goToTab('Descriptor Files')
            });

            it('Should have content in file viewer', function() {
                cy
                    .get(".ace_content")
                    .should("be.visible")
            });
        });

        describe('Change tab to Test Parameters', function() {
            beforeEach(function() {
                cy.goToTab('Test Parameter Files')
            });

            it('Should have content in file viewer', function() {
                cy
                    .get(".ace_content")
                    .should("be.visible")
            });
        });
    });
})

describe('Dockstore Tool Details of quay.io/A2/b3', function() {
    require('./helper.js')
    beforeEach(function() {
        cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/b3")
        cy
            .get('tab')
            .should('have.length', 7)
    });

    it('Change tab to versions, should only have one visible', function() {
        cy.goToTab('Versions')

        cy.url().should('eq', String(global.baseUrl) + '/containers/quay.io/A2/b3:latest?tab=versions')

        cy
            .get('tbody>tr')
            .should('have.length', 1)
    });

})
