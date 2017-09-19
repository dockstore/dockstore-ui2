describe('Dropdown test', function() {
    require('./helper.js')

    beforeEach(function() {
        cy.visit(String(global.baseUrl))

        // Select dropdown
        cy
            .get('#dropdown-main')
            .click()
    });

    describe('Go to starred page', function() {
        beforeEach(function() {
            // Select dropdown tokens
            cy
                .get('#dropdown-starred')
                .click()
        });

        it('Should have nothing starred', function() {
            cy
                .get('#starCountButton')
                .should('not.be.visible')
            cy
                .get('#starringButton')
                .should('not.be.visible')
        });
    });

    describe('Go to accounts page', function() {
        beforeEach(function() {
            // Select dropdown accounts
            cy
                .get('#dropdown-accounts')
                .click()
        });

        it('Should show all accounts as linked (except GitLab and Bitbucket)', function() {
            cy
                .get('h4').contains('GitHub').siblings('.btn-group').children('div').children('.btn-success').should('be.visible')
            cy
                .get('h4').contains('Quay.io').siblings('.btn-group').children('div').children('.btn-success').should('be.visible')
            cy
                .get('h4').contains('Bitbucket').siblings('.btn-group').children('div').should('not.be.visible')
            cy
                .get('h4').contains('GitLab').siblings('.btn-group').children('div').should('not.be.visible')
        });
    });

    describe('Go to tokens page', function() {
        beforeEach(function() {
            // Select dropdown tokens
            cy
                .get('#dropdown-tokens')
                .click()
        });

        it('Should have three tokens', function() {
            expect(('#dockstore_token')).to.exist;
            expect(('#github.com_token')).to.exist;
            expect(('#quay.io_token')).to.exist;
        });
    });

    describe('Go to setup page', function() {
        beforeEach(function() {
            // Select dropdown setup
            cy
                .get('#dropdown-onboarding')
                .click()
        });

        it('Should show all accounts as linked (except GitLab and Bitbucket)', function() {
            cy
                .get('h4').contains('GitHub').siblings('.btn-group').children('div').children('.btn-success').should('be.visible')
            cy
                .get('h4').contains('Quay.io').siblings('.btn-group').children('div').children('.btn-success').should('be.visible')
            cy
                .get('h4').contains('Bitbucket').siblings('.btn-group').children('div').should('not.be.visible')
            cy
                .get('h4').contains('GitLab').siblings('.btn-group').children('div').should('not.be.visible')
        });

        it('Go through steps', function() {
            // Should start on step 1
            cy
                .get('h3').contains('Step 1')
                .should('be.visible')
            cy
                .get('h3').contains('Step 2')
                .should('not.be.visible')
            cy
                .get('h3').contains('Step 3')
                .should('not.be.visible')
            cy
                .get('#next_step')
                .click()

            // Should now be on step 2
            cy
                .get('h3').contains('Step 1')
                .should('not.be.visible')
            cy
                .get('h3').contains('Step 2')
                .should('be.visible')
            cy
                .get('h3').contains('Step 3')
                .should('not.be.visible')
            cy
                .get('#next_step')
                .click()

            // Should now be on step 3
            cy
                .get('h3').contains('Step 1')
                .should('not.be.visible')
            cy
                .get('h3').contains('Step 2')
                .should('not.be.visible')
            cy
                .get('h3').contains('Step 3')
                .should('be.visible')
            cy
                .get('#finish_step')
                .click()
        });
    });
});