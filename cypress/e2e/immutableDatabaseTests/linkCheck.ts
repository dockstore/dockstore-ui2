import { setTokenUserViewPort } from '../../support/commands';

// Formats paths to be displayed in an error log
function formatPaths(paths: string[]): string {
  let formattedPaths = '';
  paths.forEach((path) => {
    formattedPaths += '\n- ' + path;
  });
  return formattedPaths;
}

describe('Find broken anchor links', () => {
  setTokenUserViewPort();

  // These links should be intentionally skipped
  const skippedUrls: string[] = [
    'https://twitter.com/DockstoreOrg', // Test only fails because it redirects to login page if not logged in
  ];

  let visitedUrls: string[] = [];

  function isDynamicUrl(url: string): boolean {
    return url.includes('/my-workflows/') || url.includes('/my-tools/') || url.includes('/my-notebooks/');
  }

  function checkUrls(path: string) {
    let brokenUrls = [];
    cy.visit(path).wait(1000); // Temporary solution to ensure the page loads entirely
    cy.get('a')
      .each((anchor) => {
        cy.get(anchor).then((anchor) => {
          const href = anchor.prop('href');
          // Send requests to non-dynamic URLs that haven't yet been visited and shouldn't be skipped
          if (href && !skippedUrls.includes(href) && !visitedUrls.includes(href) && !isDynamicUrl(href)) {
            cy.request({
              url: href,
              failOnStatusCode: false,
            }).then((result) => {
              const isOk = result.status === 200;
              // Is the response a cloudflare challenge?
              // https://developers.cloudflare.com/waf/reference/cloudflare-challenges/
              const isChallenge = result.status === 403 && result.headers['cf-mitigated'] === 'challenge';
              if (isOk || isChallenge) {
                visitedUrls.push(href); // Add successful links to visitedUrls so that they won't be visited again
              } else {
                brokenUrls.push(href);
                cy.log(`${result.status}: ${href}`);
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

  const urlPages: string = ['/', '/sitemap', '/about', '/funding', '/docs', '/dashboard', '/quick-start'];

  urlPages.forEach((urlPage) => {
    it(`anchor links at "${urlPage}" should work`, () => {
      checkUrls(urlPage);
    });
  });
});

describe('Find broken image links', () => {
  setTokenUserViewPort();

  const skippedImages: string = [
    'http://localhost:4200/', // Failing stock avatar image in navbar
  ];

  let visitedImages: string = [];

  function checkImages(path: string, selector: string) {
    let brokenImages = [];
    cy.visit(path).wait(1000);
    cy.get('app-root').should('be.visible');
    cy.get('img')
      .each((image) => {
        cy.get(image).then((image) => {
          const src = image.prop('src');
          if (!skippedImages.includes(src) && !visitedImages.includes(src)) {
            if (image.prop('naturalWidth') === 0) {
              brokenImages.push(src);
              cy.log(`image not visible: ${src}`);
            } else {
              visitedImages.push(src);
            }
          }
        });
      })
      .then(() => {
        if (brokenImages.length) {
          throw new Error(`Broken images at "${path}":` + formatPaths(brokenImages));
        }
      });
  }

  const imagePages: string = [
    '/',
    '/about',
    '/funding',
    '/docs',
    '/dashboard',
    '/workflows',
    '/notebooks',
    '/services',
    '/apptools',
    '/search-workflows',
    '/tools',
    '/containers',
    '/search-containers',
    '/accounts',
  ];

  imagePages.forEach((imagePage) => {
    it(`images at "${imagePage}" should work`, () => {
      checkImages(imagePage);
    });
  });
});
