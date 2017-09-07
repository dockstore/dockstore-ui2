
describe('Dockstore Workflow Details', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/workflows/A/l")
  });

	it('should not show Edit Button', function() {
    // edit button should only appear inside "My Workflows"
    // unless logged in as the author, edit button should not be present in "Workflows"
    cy
      .get("#editButton")
        .should("exist")
        .should("not.be.visible")
  });

  it('Change tab to labels', function() {
    cy
      .get("#labelsTab")
        .click()
  });

  it('Change tab to versions', function() {
    cy
      .get("#versionsTab")
        .click()
  });

  describe('Change tab to files', function() {
    beforeEach(function() {
      cy
        .get("#filesTab")
          .click()
    });

    it('Should have Descriptor files tab selected', function() {
      cy
        .get("#descriptorTab")
          .should("have.class", "active")
    });

    it('Should have content in file viewer', function() {
      cy
        .get(".hljs.yaml")
          .children()
          .should("exist")
    });

      describe('Change tab to Test Parameters', function() {
          beforeEach(function() {
            cy
              .get("#testParameterTab")
                .click()
          });

          it('Should not have content in file viewer', function() {
            cy
              .get(".hljs.yaml")
                .children()
                .should("not.exist")
          });
      });
  });

  it('Change tab to tools', function() {
    cy
      .get("#toolsTab")
          .click()
  });

  describe('Change tab to dag', function () {
    beforeEach(function() {
      cy
        .get("#dagTab")
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
