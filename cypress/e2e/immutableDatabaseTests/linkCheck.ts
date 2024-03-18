import { setTokenUserViewPort } from '../../support/commands';

// Formats paths to be displayed in an error log
function formatPaths(paths: string[]) {
  let formattedPaths = '';
  paths.forEach((path) => {
    formattedPaths += '\n- ' + path;
  });
  return formattedPaths;
}

// Represents a page to visit on the site - organizes urlPages, imagePages
interface Page {
  path: string;
  selector: string;
}

describe('Find broken anchor links', () => {
  setTokenUserViewPort();

  function checkUrls(path: string, selector: string) {
    let brokenUrls = [];
    cy.visit(path);
    cy.get(selector)
      .find('a')
      .each((anchor) => {
        cy.get(anchor).then((anchor) => {
          const href = anchor.prop('href');
          if (href) {
            cy.request({
              url: href,
              failOnStatusCode: false,
            }).then((result) => {
              if (result.status != 200) {
                brokenUrls.push(href);
                cy.log(result.status + ': ' + href);
              }
            });
          }
        });
      })
      .then(() => {
        if (brokenUrls.length) {
          throw new Error(`Broken links at "${path}":` + formatPaths(brokenUrls));
        }
      });
  }

  const urlPages: Page[] = [
    { path: '/', selector: 'app-root' },
    { path: '/sitemap', selector: 'app-sitemap' },
    { path: '/about', selector: 'app-about' },
    { path: '/funding', selector: 'app-funding' },
    { path: '/docs', selector: 'app-docs' },
    { path: '/dashboard', selector: 'app-my-sidebar' },
  ];

  urlPages.forEach((urlPage) => {
    it(`anchor links at "${urlPage.path}" should work`, () => {
      checkUrls(urlPage.path, urlPage.selector);
    });
  });
});

describe('Find broken image links', () => {
  setTokenUserViewPort();

  function checkImages(path: string, selector: string) {
    let brokenImages = [];
    cy.visit(path).wait(500);
    cy.get(selector)
      .find('img')
      .each((image) => {
        cy.get(image).then((image) => {
          if (image.prop('naturalWidth') === 0) {
            brokenImages.push(image.prop('src'));
            cy.log('image not visible: ' + image.prop('src'));
          }
        });
      })
      .then(() => {
        if (brokenImages.length) {
          throw new Error(`Broken images at "${path}":` + formatPaths(brokenImages));
        }
      });
  }

  const imagePages: Page[] = [
    { path: '/', selector: 'app-root' },
    { path: '/about', selector: 'app-about' },
    { path: '/funding', selector: 'app-funding' },
    { path: '/docs', selector: 'app-docs' },
    { path: '/dashboard', selector: 'app-dashboard' },
    { path: '/workflows', selector: 'app-workflows' },
    { path: '/notebooks', selector: 'app-workflows' },
    { path: '/services', selector: 'app-workflows' },
    { path: '/apptools', selector: 'app-workflows' },
    { path: '/search-workflows', selector: 'app-workflows' },
    { path: '/tools', selector: 'app-containers' },
    { path: '/containers', selector: 'app-containers' },
    { path: '/search-containers', selector: 'app-containers' },
    { path: '/accounts', selector: 'app-account-sidebar' },
    { path: '/accounts', selector: 'app-accounts-external' },
  ];

  imagePages.forEach((imagePage) => {
    it(`images at "${imagePage.path}" should work`, () => {
      checkImages(imagePage.path, imagePage.selector);
    });
  });
});
