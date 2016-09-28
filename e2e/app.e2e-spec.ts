import { NgcliPage } from './app.po';

describe('ngcli App', function() {
  let page: NgcliPage;

  beforeEach(() => {
    page = new NgcliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
