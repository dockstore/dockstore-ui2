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
     cy
      .get('tab')
      .should('have.length', 8) // 8 Tabs include all top level tabs plus 2 tabs in the files tab
     cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=info')
  });

	it('should not show Edit Button', function() {
    // edit button should only appear inside "My Workflows"
    // unless logged in as the author, edit button should not be present in "Workflows"
    cy
      .get("#editButton")
        .should("not.exist")
  });

  it('Change tab to labels', function() {
    cy
    .get('.nav-link')
    .contains('Labels')
    .parent()
    .click()
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=labels')
  });

  it('Change tab to versions', function() {
    cy
    .get('.nav-link')
    .contains('Versions')
    .parent()
    .click()
    cy
        .get('tbody>tr')
        .should('have.length', 2) // 1 Version and warning line
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=versions')
  });

  describe('Change tab to files', function() {
    beforeEach(function() {
      cy
      .get('.nav-link')
      .contains('Files')
      .parent()
      .click()
      cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=files')
    });

    it('Should have Descriptor files tab selected', function() {
      cy
      .get('.nav-link')
      .contains('Descriptor Files')
      .parent()
      .click()
          .should("have.class", "active")
    });

    it('Should have content in file viewer', function() {
      cy
      .get(".ace_content")
      .should("be.visible")
    });

      describe('Change tab to Test Parameters', function() {
          beforeEach(function() {
            cy
            .get('.nav-link')
            .contains('Test Parameter Files')
            .parent()
            .click()
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
    cy
    .get('.nav-link')
    .contains('Tools')
    .parent()
    .click()
    cy.url().should('eq', String(global.baseUrl) + '/workflows/github.com/A/l:master?tab=tools')
  });

  describe('Change tab to dag', function () {
    beforeEach(function() {
      cy
      .get('.nav-link')
      .contains('DAG')
      .parent()
      .click()
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
