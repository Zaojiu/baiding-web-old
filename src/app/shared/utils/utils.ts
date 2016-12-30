interface Window {
  navigator: any;
}

declare var window: Window;
declare var DocumentTouch: any;

export class UtilsService {
  static isInWechat = /micromessenger/i.test(window.navigator.userAgent);
  static isiOS = /iPhone|iPad/i.test(window.navigator.userAgent);
  static isInApp = /zaojiuliveapp/i.test(window.navigator.userAgent);
  static isInBaidingApp = /baidingapp\.com/i.test(location.hostname);
  static isTouchable = (<any>window).DocumentTouch && document instanceof DocumentTouch;

  static setStorage(key: string, value: Object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getStorage(key: string): any {
    return JSON.parse(localStorage.getItem(key)) || {};
  }

  static get isInWechat(): boolean {
    return /micromessenger/i.test(window.navigator.userAgent);
  }

  static get isiOS(): boolean {
    return /iPhone|iPad/i.test(window.navigator.userAgent);
  }

  static get isAndroid(): boolean {
    return /Android/i.test(window.navigator.userAgent);
  }

  static get isInApp(): boolean {
    return /zaojiuliveapp/i.test(window.navigator.userAgent);
  }

  static get isOnScreen(): boolean {
    return matchMedia && matchMedia('(min-width: 768px)').matches;
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

  static resetWindowScroll() {
    setTimeout(() => {
      document.body.scrollTop = document.body.scrollHeight;
    }, 400);
  }

  static randomId(size = 10, dic?: string): string {
    let defaultDic: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return _.sampleSize<string>((dic || defaultDic).split(''), size).join('');
  }
}
