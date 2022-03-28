// These tests check for security-related headers.

before(() => {
  cy.visit('');
});

// Function to check that the value of the response header "headerKey"
// contains the substring "containsValue".
function checkHeaderValueContains(url: string, headerKey: string, containsValue: string) {
    cy.request(url).then((resp) => {
        expect(resp.headers).to.have.property(headerKey);
        const headerValue = resp.headers[headerKey];
        expect(headerValue).to.include(containsValue);
    });
}


describe('Test for security headers', () => {
  it('Check for presence of headers in response', () => {
    cy.request('/').then((resp) => {
        expect(resp).to.have.property('headers');
    });
  });

  // ----------------
  // x-xss-protection
  // stop pages from loading when xss attacks detected
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
  it('Check x-xss-protection headers in response', () => {
    checkHeaderValueContains('/', 'x-xss-protection', 'mode=block');
  });

  // ---------
  // expect-ct
  // reporting and enforcement of certificate transparency requirements
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT
  it('Check expect-ct headers in response', () => {
    checkHeaderValueContains('/', 'expect-ct', 'enforce, max-age=');
  });

});
