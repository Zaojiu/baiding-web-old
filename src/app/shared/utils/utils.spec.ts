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

describe('utils parse link test', () => {
  let parser = null;

  beforeEach(() => {
    parser = UtilsService.parseLink;
  });

  it(`positive parse`, async(() => {
    const content = 'back好的http://www.baidu.com好的https://www.baidu.com好的www.baidu.com好的baidu.com好的baidu.com/好的https://www.baidu.com/aa/bb好的https://www.baidu.com/aa/bb';
    const expected = 'back好的<a href="http://www.baidu.com" target="_blank">http://www.baidu.com</a>好的<a href="https://www.baidu.com" target="_blank">https://www.baidu.com</a>好的<a href="http://www.baidu.com" target="_blank">www.baidu.com</a>好的<a href="http://baidu.com" target="_blank">baidu.com</a>好的<a href="http://baidu.com/" target="_blank">baidu.com/</a>好的<a href="https://www.baidu.com/aa/bb" target="_blank">https://www.baidu.com/aa/bb</a>好的<a href="https://www.baidu.com/aa/bb" target="_blank">https://www.baidu.com/aa/bb</a>';
    expect(parser(content)).toEqual(expected);
  }));
});

describe('utils serializeObj test', () => {
  let parser = null;

  beforeEach(() => {
    parser = UtilsService.serializeObj;
  });

  it(`positive parse ''`, async(() => {
    const content = '';
    const expected = {};
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse 'a=b'`, async(() => {
    const content = 'a=b';
    const expected = {
      'a': 'b',
    };
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse 'a=b&c=1&d=2 3'`, async(() => {
    const content = 'a=b&c=1&d=2%203';
    const expected = {
      'a': 'b',
      'c': '1',
      'd': '2 3'
    };
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse 'a='`, async(() => {
    const content = 'a=';
    const expected = {'a': ''};
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse '=b'`, async(() => {
    const content = '=b';
    const expected = {'': 'b'};
    expect(parser(content)).toEqual(expected);
  }));
});

describe('utils deserializeObj test', () => {
  let parser = null;

  beforeEach(() => {
    parser = UtilsService.deserializeObj;
  });

  it(`positive parse {}`, async(() => {
    const content = {};
    const expected = '';
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse {'a': 'b'}`, async(() => {
    const content = {
      'a': 'b',
    };
    const expected = 'a=b';
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse '{'a': 'b', 'c': '1', 'd': '2 3'}'`, async(() => {
    const content = {
      'a': 'b',
      'c': '1',
      'd': '2 3'
    };
    const expected = 'a=b&c=1&d=2%203';
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse {'a': undefined}`, async(() => {
    const content = {'a': (<any>undefined)};
    const expected = 'a=';
    expect(parser(content)).toEqual(expected);
  }));

  it(`positive parse {undefined: 'b'}`, async(() => {
    const content = {[(<any>undefined)]: 'b'};
    const expected = '=b';
    expect(parser(content)).toEqual(expected);
  }));
});
