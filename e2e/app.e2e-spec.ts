import { TemplatePage } from './app.po';

describe('template App', () => {
  let page: TemplatePage;

  beforeEach(() => {
    page = new TemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
