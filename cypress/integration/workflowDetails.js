
describe('Dockstore Workflow Details', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/workflows/github.com/A/l")
     cy.visit(String(global.baseUrl) + "/workflows/github.com%2FA%2Fl")
     cy
      .get('tab')
      .should('have.length', 8) // 8 Tabs include all top level tabs plus 2 tabs in the files tab

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
  });

  it('Change tab to versions', function() {
    cy
    .get('.nav-link')
    .contains('Versions')
    .parent()
    .click()
  });

  describe('Change tab to files', function() {
    beforeEach(function() {
      cy
      .get('.nav-link')
      .contains('Files')
      .parent()
      .click()
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
      .get(".hljs.yaml")
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
              .get(".hljs.yaml")
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
  });

  describe('Change tab to dag', function () {
    beforeEach(function() {
      cy
      .get('.nav-link')
      .contains('DAG')
      .parent()
      .click()
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
