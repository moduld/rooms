import { TifoPage } from './app.po';

describe('tifo App', () => {
  let page: TifoPage;

  beforeEach(() => {
    page = new TifoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
