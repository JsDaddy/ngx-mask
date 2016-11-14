import { Ng2MaskPage } from './app.po';

describe('ng2-mask App', function() {
  let page: Ng2MaskPage;

  beforeEach(() => {
    page = new Ng2MaskPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
