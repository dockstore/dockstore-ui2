global.baseUrl = "http://10.11.8.92.nip.io:4200";

describe('Workflow starring while not logged in', function() {
  beforeEach(function() {
    cy.clearLocalStorage()
    cy.visit(String(global.baseUrl) + "/workflows/github.com/A/l")
  });

  describe('Select a Workflow', function() {
    it('Workflow can\'t be starred/unstarred when not logged in', function() {
      cy
        .get('#starringButton')
        .should('be.disabled')
      cy
        .get('#starCountButton')
        .should('not.be.disabled')

    });
  });
})

describe('Tool starring while not logged in', function() {
  beforeEach(function() {
    cy.clearLocalStorage()
    cy.visit(String(global.baseUrl) + "/containers/quay.io/A2/a")
  });

  describe('Select a tool', function() {
    it('Tool can\'t be starred/unstarred when not logged in', function() {
      cy
        .get('#starringButton')
        .should('be.disabled')
      cy
        .get('#starCountButton')
        .should('not.be.disabled')

    });
  });
})
