import { setTokenUserViewPort } from '../../support/commands';

describe('Find broken links', () => {
  setTokenUserViewPort();

  function checkUrls(path: string, selector: string) {
    cy.visit(path);
    cy.get(selector).within(() => {
      cy.get('a').each((url) => {
        cy.get(url);
        const href = url.prop('href');
        if (href) {
          cy.request({
            url: url.prop('href'),
            failOnStatusCode: false,
          }).then((result) => {
            if (result.status != 200) {
              cy.log(result.status + ': ' + href);
            }
          });
        }
      });
    });
  }

  function checkImages(path: string, selector: string) {
    cy.visit(path).wait(500);
    cy.get(selector).within(() => {
      cy.get('img').each((image) => {
        cy.get(image);
        if (image.prop('naturalWidth') === 0 && image.prop('naturalHeight') === 0) {
          cy.log('image not visible: ' + image.prop('src'));
        }
      });
    });
  }

  const urlPages = [
    ['/', 'app-root'],
    ['/sitemap', 'app-sitemap'],
    ['/about', 'app-about'],
    ['/funding', 'app-funding'],
    ['/docs', 'app-docs'],
    ['/dashboard', 'app-my-sidebar'],
  ];

  const imagePages = [
    ['/', 'app-root'],
    ['/about', 'app-about'],
    ['/funding', 'app-funding'],
    ['/docs', 'app-docs'],
    ['/dashboard', 'app-dashboard'],
    ['/workflows', 'app-workflows'],
    ['/notebooks', 'app-workflows'],
    ['/services', 'app-workflows'],
    ['/apptools', 'app-workflows'],
    ['/search-workflows', 'app-workflows'],
    ['/tools', 'app-containers'],
    ['/containers', 'app-containers'],
    ['/search-containers', 'app-containers'],
    ['/accounts', 'app-account-sidebar'],
    ['/accounts', 'app-accounts-external'],
  ];

  it('should detect broken anchor links', () => {
    urlPages.forEach((page) => {
      checkUrls(page[0], page[1]);
    });
  });

  it('should detect broken images', () => {
    imagePages.forEach((page) => {
      checkImages(page[0], page[1]);
    });
  });
});
