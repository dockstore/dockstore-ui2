// These tests check for security-related headers.

before(() => {
  cy.visit('');
});

describe('Test for security headers', () => {
  it('Check for presence of headers in response', () => {
    cy.request('/').then((resp) => {
        expect(resp).to.have.property('headers');
    });
  });

  it('Check for x-xss-protection header in response', () => {
    cy.request('/').then((resp) => {
        expect(resp.headers).to.have.property('x-xss-protection');
    });
  });

  it('Check that x-xss-protection header has correct value', () => {
    cy.request('/').then((resp) => {
        const headerval = resp.headers['x-xss-protection'];
        expect(headerval).to.include('mode=block');
    });
  });

});
