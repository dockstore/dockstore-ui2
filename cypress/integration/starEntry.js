/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
describe('Tool and Workflow starring', function() {
    require('./helper.js')

    function beUnstarred() {
        cy
            .get('#starringButtonIcon')
            .should("have.class", "glyphicon-star-empty")
        cy
            .get('#starCountButton')
            .should('contain', '0')
    }

    function beStarred() {
        cy
            .get('#starringButtonIcon')
            .should("have.class", "glyphicon-star")
        cy
            .get('#starCountButton')
            .should('contain', '1')
    }

    function entryStarring(url) {
        cy.visit(url)
        cy
            .get('#starringButton')
            .should('not.be.disabled')
            .should('be.visible')
        cy
            .get('#starCountButton')
            .should('not.be.disabled')
            .should('be.visible')

        beUnstarred();

        cy
            .get('#starCountButton')
            .click()

        cy
            .get('.alert')
            .should('exist')

        cy
            .get('#backButton')
            .should('exist')
            .should('not.be.disabled')
            .click()

        beUnstarred();

        cy
            .get('#starringButton')
            .click()

        beStarred();

        cy
            .get('#starCountButton')
            .click()

        cy
            .get('.alert')
            .should('not.exist')

        cy
            .get('#backButton')
            .should('exist')
            .should('not.be.disabled')
            .click()

        cy
            .get('#dropdown-main')
            .click()
        cy
            .get('#dropdown-starred')
            .click()
        cy
            .get('#starringButton')
            .should('exist')
        cy
            .get('#starCountButton')
            .should('exist')

        cy.visit(url)

        beStarred();

        cy
            .get('#starringButton')
            .click()

        beUnstarred();

        cy
            .get('#starCountButton')
            .click()

        cy
            .get('.alert')
            .should('exist')
    }

    describe('Workflow starring', function() {
        it('Workflow can be starred/unstarred', function() {
            entryStarring(String(global.baseUrl) + "/workflows/github.com/A/l")

        });
    });
    describe('Tool Starring', function() {
        it('Tool can be starred/unstarred', function() {
            entryStarring(String(global.baseUrl) + "/containers/quay.io/A2/a")
        });
    });
})
