import { DockstoreUi2Page } from './app.po';

describe('dockstore-ui2 App', () => {
  let page: DockstoreUi2Page;

  beforeEach(() => {
    page = new DockstoreUi2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
