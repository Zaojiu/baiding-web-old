import {async} from '@angular/core/testing';
import {UtilsService} from './utils';

describe('utils now test', () => {
  let now = 0;

  beforeEach(() => {
    now = UtilsService.now;
  });

  it('now should return number', async(() => {
    expect(typeof now === 'number').toBeTruthy();
  }));
});

describe('utils parse at test', () => {
  let parser = null;

  beforeEach(() => {
    parser = UtilsService.parseAt;
  });

  it('parse single at', async(() => {
    let content = '@杜晓峰(1234567)';
    expect(parser(content)).toEqual('@杜晓峰');
  }));

  it(`parse single at with other text`, async(() => {
    let content = 'aaaaaaa@杜晓峰(1234567)aaaaaaa';
    expect(parser(content)).toEqual('aaaaaaa@杜晓峰aaaaaaa');
  }));

  it('parse single at with highlight return', async(() => {
    let content = '@杜晓峰(1234567)';
    expect(parser(content, true)).toEqual('<span class="highlight">@杜晓峰</span>');
  }));

  it(`parse single at with other text and highlight return`, async(() => {
    let content = 'aaaaaaa@杜晓峰(1234567)aaaaaaa';
    expect(parser(content, true)).toEqual('aaaaaaa<span class="highlight">@杜晓峰</span>aaaaaaa');
  }));


  it('parse mutiple at', async(() => {
    let content = '@杜晓峰(1234567)@杜晓峰2(2345678)';
    expect(parser(content)).toEqual('@杜晓峰@杜晓峰2');
  }));

  it(`parse mutiple at with other text`, async(() => {
    let content = 'aaaaaaa@杜晓峰(1234567)aaaaaaa@杜晓峰2(2345678)aaaaaaa';
    expect(parser(content)).toEqual('aaaaaaa@杜晓峰aaaaaaa@杜晓峰2aaaaaaa');
  }));

  it('parse mutiple at with highlight return', async(() => {
    let content = '@杜晓峰(1234567)@杜晓峰2(2345678)';
    expect(parser(content, true)).toEqual('<span class="highlight">@杜晓峰</span><span class="highlight">@杜晓峰2</span>');
  }));

  it(`parse mutiple at with other text and highlight return`, async(() => {
    let content = 'aaaaaaa@杜晓峰(1234567)aaaaaaa@杜晓峰2(2345678)aaaaaaa';
    expect(parser(content, true)).toEqual('aaaaaaa<span class="highlight">@杜晓峰</span>aaaaaaa<span class="highlight">@杜晓峰2</span>aaaaaaa');
  }));

  it(`parse mutiple at with other text and highlight return`, async(() => {
    let content = 'aaaaaaa@杜晓峰(1234567)aaaaaaa@杜晓峰2(2345678)aaaaaaa';
    expect(parser(content, true)).toEqual('aaaaaaa<span class="highlight">@杜晓峰</span>aaaaaaa<span class="highlight">@杜晓峰2</span>aaaaaaa');
  }));

  it(`parse text without at`, async(() => {
    let content = 'a@#!~$%^&*()_+|{}":<>? 1';
    expect(parser(content)).toEqual('a@#!~$%^&*()_+|{}":<>? 1');
  }));

  it(`parse with highlight option and text without at`, async(() => {
    let content = 'a@#!~$%^&*()_+|{}":<>? 1';
    expect(parser(content, true)).toEqual('a@#!~$%^&*()_+|{}":<>? 1');
  }));
});
