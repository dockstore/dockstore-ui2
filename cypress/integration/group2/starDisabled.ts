/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { resetDB } from '../../support/commands';

describe('Workflow starring while not logged in', () => {
  resetDB();
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/workflows/github.com/A/l');
  });

  describe('Select a Workflow', () => {
    it("Workflow can't be starred/unstarred when not logged in", () => {
      cy.get('#starringButton').should('be.disabled');
      cy.get('#starCountButton').should('not.be.disabled');
    });
  });
});

describe('Tool starring while not logged in', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/containers/quay.io/A2/a');
  });

  describe('Select a tool', () => {
    it("Tool can't be starred/unstarred when not logged in", () => {
      cy.get('#starringButton').should('be.disabled');
      cy.get('#starCountButton').should('not.be.disabled');
    });
  });
});
