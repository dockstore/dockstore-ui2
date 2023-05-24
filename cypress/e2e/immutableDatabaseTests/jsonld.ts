/*
 *
 *  * Copyright 2022 OICR and UCSC
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *         http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 *
 */

describe('JSON-LD', () => {
  it('Home page should have json-ld', () => {
    cy.visit('');
    // Two json-lds
    cy.get('[type="application/ld+json"]').should('have.length', 2);
    cy.get('[type="application/ld+json"]').should('contain.text', '"description": "Dockstore, developed');
    cy.get('[type="application/ld+json"]').should('contain.text', '"audience": "Bioinformaticians"');
  });
});
