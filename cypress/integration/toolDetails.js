describe('Dockstore Tool Details', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a")
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

    it('Should have Dockerfile tab selected', function() {
      cy
        .get("#dockerfileTab")
          .should("have.class", "active")
    });

    it('Should have content in file viewer', function() {
      cy
        .get(".hljs.yaml")
          .children()
          .should("exist")
    });

      describe('Change tab to Descriptor files', function() {
          beforeEach(function() {
            cy
              .get("#descriptorTab")
                .click()
          });

          it('Should have content in file viewer', function() {
            cy
              .get(".hljs.yaml")
                .children()
                .should("exist")
          });
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
})
