import { setTokenUserViewPort } from '../../support/commands';

function formatPaths(paths: string[]) {
  let formattedPaths = '';
  paths.forEach((path) => {
    formattedPaths += '\n- ' + path;
  });
  return formattedPaths;
}

describe('Find broken anchor links', () => {
  setTokenUserViewPort();

  function checkUrls(path: string, selector: string) {
    let brokenUrls = [];
    cy.visit(path);
    cy.get(selector)
      .find('a')
      .each((url) => {
        cy.get(url).then((url) => {
          const href = url.prop('href');
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

  const urlPages = [
    ['/', 'app-root'],
    ['/sitemap', 'app-sitemap'],
    ['/about', 'app-about'],
    ['/funding', 'app-funding'],
    ['/docs', 'app-docs'],
    ['/dashboard', 'app-my-sidebar'],
  ];

  urlPages.forEach((urlPage) => {
    it(`anchor links at "${urlPage[0]}" should work`, () => {
      checkUrls(urlPage[0], urlPage[1]);
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

  imagePages.forEach((imagePage) => {
    it(`images at "${imagePage[0]}" should work`, () => {
      checkImages(imagePage[0], imagePage[1]);
    });
  });
});
