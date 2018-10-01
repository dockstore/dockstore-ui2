describe('Variations of URL', function() {
  require('./helper.js')
  it('Should redirect to canonical url (encoding)', function() {
    cy.visit(String(global.baseUrl) + "/workflows/github.com%2FA%2Fl")
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=info')
  });
  it('Should redirect to canonical url (version)', function() {
    cy.visit(String(global.baseUrl) + "/workflows/github.com/A/l:master")
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=info')
  });
  it('Should redirect to canonical url (tab)', function() {
    cy.visit(String(global.baseUrl) + "/workflows/github.com/A/l?tab=files")
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=files')
  });
  it('Should redirect to canonical url (version + tab)', function() {
    cy.visit(String(global.baseUrl) + "/workflows/github.com/A/l:master?tab=files")
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=files')
  });
  it('Should redirect to canonical url (encoding + version + tab)', function() {
    cy.visit(String(global.baseUrl) + "/workflows/github.com%2FA%2Fl:master?tab=files")
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=files')
  });
});

describe('Dockstore Workflow Details', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/workflows/github.com/A/l")
     // 6 Tabs include all top level tabs and not the 2 tabs in the files tab
     cy
     .get('.mat-tab-label')
     .should('have.length', 6)
     cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=info')
  });

	it('should not show Edit Button', function() {
    // edit button should only appear inside "My Workflows"
    // unless logged in as the author, edit button should not be present in "Workflows"
    cy
      .get("#editButton")
        .should("not.exist")
  });

  it('Change tab to launch', function() {
    cy.goToTab('Launch')
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=launch')
  });

  it('Change tab to versions', function() {
    cy.goToTab('Versions')
    cy
        .get('tbody>tr')
        .should('have.length', 1) // 1 Version and no warning line
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=versions')
  });

  describe('Change tab to files', function() {
    beforeEach(function() {
      cy.goToTab('Files')
      cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=files')
    });

    it('Should have Descriptor files tab selected', function() {
      cy.goToTab('Descriptor Files')
          .click()
          .parent()
          .should("have.class", "mat-tab-label-active")
    });

    it('Should have content in file viewer', function() {
      cy
      .get(".ace_content")
      .should("be.visible")
    });

      describe('Change tab to Test Parameters', function() {
          beforeEach(function() {
            cy.goToTab('Test Parameter Files')
          });

          it('Should not have content in file viewer', function() {
            cy
              .get(".ace_content")
                .children()
                .should("not.be.visible")
          });
      });
  });

  it('Change tab to tools', function() {
    cy.get('.mat-tab-header-pagination-after').click()
    cy.goToTab('Tools')
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=tools')
  });

  describe('Change tab to dag', function () {
    beforeEach(function() {
      cy.get('.mat-tab-header-pagination-after').click()
      cy.goToTab('DAG')
      cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=dag')
    });

    it('Change to fullscreen and back', function() {
      cy
        .get("#dag_fullscreen")
          .click()
          .get("#dag-col")
            .should("have.class", "fullscreen-element")
            .get("#dag_fullscreen")
              .click()
              .should("not.have.class", "fullscreen-element")
    });
  });
})
