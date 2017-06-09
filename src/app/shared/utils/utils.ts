interface Window {
  navigator: any;
}

declare var window: Window;
declare var DocumentTouch: any;

export class UrlModel {
  protocol: string;
  host: string;
  hostname: string;
  port: number;
  pathname: string;
  search: string;
  hash: string;

  constructor(protocol: string, host: string, hostname: string, port: number, pathname: string, search: string, hash: string) {
    this.protocol = protocol;
    this.host = host;
    this.hostname = hostname;
    this.port = port;
    this.pathname = pathname;
    this.search = search;
    this.hash = hash;
  }
}

export class UtilsService {
  static isInWechat = /micromessenger/i.test(navigator.userAgent);
  static isiOS = /iPhone|iPad/i.test(navigator.userAgent);
  static isInApp = /zaojiuliveapp/i.test(navigator.userAgent);
  static isInBaidingApp = /baidingapp\.com/i.test(location.hostname);
  static isTouchable = (<any>window).DocumentTouch && document instanceof DocumentTouch;
  static isAndroid = /Android/i.test(navigator.userAgent);
  static isOnLargeScreen = matchMedia && matchMedia('(min-width: 1024px)').matches;
  static isChrome = /Chrome/i.test(navigator.userAgent);
  static isWindowsWechat = /WindowsWechat/i.test(navigator.userAgent);

  static setStorage(key: string, value: Object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getStorage(key: string): any {
    return JSON.parse(localStorage.getItem(key)) || {};
  }

  static get isViewportLandscape(): boolean {
    return matchMedia && matchMedia('(orientation: landscape)').matches;
  }

  static get now(): number {
    return Math.floor((new Date()).getTime() / 1000);
  }

  static parseAt(content: string, needHeightLight = false): string {
    let patt = /(@.+?)(\((.+?)\)){1}/g;
    let result = null;
    let _content = content;

    while ((result = patt.exec(content)) != null) {
      if (needHeightLight) {
        _content = _content.replace(result[0], `<span class="highlight">${result[1]}</span>`);
      } else {
        _content = _content.replace(result[0], result[1]);
      }
    }

    return _content;
  }

  static parseLink(content: string): string {
    console.log('linke', content)
    let re = /(http[s]?:\/\/){0,1}(www\.){0,1}([a-zA-Z0-9\.\-]+)(\.[a-zA-Z]{2,10}){1,3}\/{0,1}.*?(?=$|\s|[^\u0000-\u007F])/;
    let result = null;
    let _content = content;

    while ((result = re.exec(content)) != null) {
      if (result[0].match(/^http/)) {
        _content = _content.replace(result[0], ` <a href="${result[0]}" target="_blank">${result[0]}</a>`);
      } else {
        _content = _content.replace(result[0], ` <a href="http://${result[0]}" target="_blank">${result[0]}</a>`);
      }
    }

    return _content;
  }

  static resetWindowScroll() {
    setTimeout(() => {
      document.body.scrollTop = document.body.scrollHeight;
    }, 800);
  }

  static parseUrl(url: string): UrlModel {
    let aEle = document.createElement('a');
    aEle.href = url;
    return new UrlModel(aEle.protocol, aEle.host, aEle.hostname, +aEle.port, aEle.pathname, aEle.search, aEle.hash);
  }

  static randomId(size = 10, dic?: string): string {
    let defaultDic: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return _.sampleSize<string>((dic || defaultDic).split(''), size).join('');
  }
}
