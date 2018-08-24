describe('Dropdown test', function () {
  // TODO: GitLab tests are commented out
  require('./helper.js')

  beforeEach(function () {
    cy
      .server()
      .route({
        method: "GET",
        url: /extended/,
        response: { "canChangeUsername": true }
      })
    cy.visit(String(global.baseUrl))

    // Select dropdown
    cy
      .get('#dropdown-main')
      .click()
  });

  describe('Go to starred page', function () {
    beforeEach(function () {
      // Select dropdown tokens
      cy
        .get('#dropdown-starred')
        .click()
    });

    it('Should have nothing starred', function () {
      cy
        .get('#starCountButton')
        .should('not.be.visible')
      cy
        .get('#starringButton')
        .should('not.be.visible')
    });
  });

  describe('Go to accounts page', function () {
    beforeEach(function () {
      // Select dropdown accounts
      cy
        .get('#dropdown-accounts')
        .click()
    });

    it('Should show all accounts as linked (except GitLab and Bitbucket)', function () {
      everythingOk();
    });
  });
  describe('Go to enabled Dockstore Account Controls', function () {
    beforeEach(function () {
      // Select dropdown accounts
      cy
        .server()
        .route({
          method: "DELETE",
          url: "/users/user",
          response: "true"
        })
      cy
        .get('#dropdown-accounts')
        .click()
      cy.contains("Dockstore Account Controls").click()
    });
    it('Should have the delete button enabled', function () {
      cy.contains("Delete Dockstore Account").should('not.be.disabled').click();
      cy.contains("Yes, delete my account").should('be.disabled')
      cy.get('#deleteUserUsernameInput').type('potato')
      cy.contains("Yes, delete my account").should('be.disabled')
      cy.get('#deleteUserUsernameInput').clear().type('user_A')
      cy.contains("Yes, delete my account").should('not.be.disabled').click()
      cy.url().should('eq', String(global.baseUrl) + '/login')
    })
    it('Should have the change username button enabled', function () {
      cy.contains("Update Username").should('not.be.disabled');
    });
  });
  var everythingOk = function () {
    cy.get('#unlink-GitHub').should('be.visible')
    cy.get('#unlink-Quay').should('be.visible')
    cy.get('#link-Bitbucket').should('be.visible')
    cy.get('#link-GitLab').should('be.visible')
  }

  var goToAccountsOnboarding = function () {
    cy
      .contains('Link External Accounts')
      .click()
  }
  describe('Go to setup page', function () {
    beforeEach(function () {

      // Select dropdown setup
      cy
        .get('#dropdown-onboarding')
        .click()
    });

    it('Should let you change your username if possible', function () {

      cy
        .get('#updateUsername')
        .should('not.be.disabled')
      cy
        .get('#username')
        .type('-')
      cy
        .get('#updateUsername')
        .should('be.disabled')
      cy
        .get('#username')
        .type('a')
      cy
        .get('#updateUsername')
        .should('not.be.disabled')
      cy
        .get('#username')
        .type('@')
      cy
        .get('#updateUsername')
        .should('be.disabled')
    });

    it('Should show all accounts as linked (except GitLab and Bitbucket)', function () {
      // everythingOk();
      // goToAccountsOnboarding();
      // cy.visit(String(global.baseUrl) + '/auth/gitlab.com?code=somefakeid', {'failOnStatusCode': false}).then((resp) => {
      //     expect(resp.status).to.eq('')
      // })
      // goToAccountsOnboarding();
      // TODO: Gitlab is being very slow, hopefully one day we can remove this
      // cy.wait(10000);

      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit(String(global.baseUrl) + '/auth/bitbucket.org?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('')
      })
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit(String(global.baseUrl) + '/auth/potato.com?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('')
      })
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit(String(global.baseUrl) + '/auth/github.com?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('')
      })
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit(String(global.baseUrl) + '/auth/quay.io?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('')
      })
      goToAccountsOnboarding();
      everythingOk();
    });
    // TODO: this part of the wizard has been reworked
    // it('Go through steps', function() {
    //     // Should start on step 1
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('be.visible')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('not.be.visible')
    //     cy
    //         .get('#next_step')
    //         .click()
    //
    //     // Should now be on step 2
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('be.visible')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('not.be.visible')
    //     cy
    //         .get('#next_step')
    //         .click()
    //
    //     // Should now be on step 3
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('be.visible')
    //     cy
    //         .get('#finish_step')
    //         .click()
    // });
  });
});
