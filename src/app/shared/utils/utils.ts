import {LiveInfoModel} from '../../shared/api/live/live.model';
interface Window {
  navigator: any;
}

declare const window: Window;
declare const DocumentTouch: any;

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
    const re = /(http[s]?:\/\/){0,1}(www\.){0,1}([a-zA-Z0-9\.\-]+)(\.[a-zA-Z]{2,10}){1,3}\/{0,1}.*?(?=$|\s|[^\u0000-\u007F])/g;
    const matchedArr = [];
    const matchedPlaceholder = '**zjMatchedLink**';
    let result = null;
    let _content = content;

    while ((result = re.exec(content)) != null) {
      if (result[0].match(/^http/)) {
        matchedArr.push(`<a href="${result[0]}" target="_blank">${result[0]}</a>`);
      } else {
        matchedArr.push(`<a href="http://${result[0]}" target="_blank">${result[0]}</a>`);
      }
      _content = _content.replace(result[0], matchedPlaceholder);
    }

    for (let item of matchedArr) {
      _content = _content.replace(matchedPlaceholder, item);
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

  static serializeObj(source: string): { [key: string]: string } {
    const kvArr = source.split('&');
    const target: { [key: string]: string } = {};
    for (let kv of kvArr) {
      const kvPair = kv.split('=');
      if (kvPair.length === 2) target[decodeURIComponent(kvPair[0])] = decodeURIComponent(kvPair[1]);
    }
    return target;
  }

  static deserializeObj(source: { [key: string]: string }): string {
    return Object.keys(source).map((k) => {
      let kStr = encodeURIComponent(k);
      if (kStr === 'undefined') kStr = '';
      let vStr = encodeURIComponent(source[k]);
      if (vStr === 'undefined') vStr = '';
      return `${kStr}=${vStr}`;
    }).join('&')
  }

  static readCookie(name: string): string {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return '';
  }

  static praseLiveTime(liveInfo: LiveInfoModel): string {
    let timePrased = '';

    if (liveInfo.isCreated()) {
      let dayStr = moment(liveInfo.expectStartAt).calendar(null, {
        sameDay: '[今天] HH:mm:ss',
        nextDay: '[明天] HH:mm:ss',
        nextWeek: 'YYYY-MM-DD HH:mm:ss',
        lastDay: 'YYYY-MM-DD HH:mm:ss',
        lastWeek: 'YYYY-MM-DD HH:mm:ss',
        sameElse: 'YYYY-MM-DD HH:mm:ss'
      });

      timePrased = `开始时间 ${dayStr}`;
    } else if (liveInfo.isStarted()) {
      let diffSec = moment(new Date().getTime()).diff(moment(liveInfo.expectStartAt)) / 1000;
      let dayStr = this.transform(diffSec, 1);
      timePrased = `已进行 ${dayStr}天${this.transform(diffSec, 2)}小时${this.transform(diffSec, 3)}分${this.transform(diffSec, 4)}秒`;
    } else if (liveInfo.isClosed()) {
      timePrased = `已于${moment(liveInfo.closedAt).format('YYYY-MM-DD HH:mm:ss')}结束`;
    } else {
      timePrased = '未知状态';
    }

    return timePrased;
  }

  static  transform(durationSecond: number, index: number): string {
    let fixDigest = (num: string) => {
      if (num.length === 1) return `0${num}`;
      return num;
    };

    if (durationSecond <= 0) return '00';

    // 适用格式 天：小时：分：秒
    let d = Math.floor(durationSecond / (24 * 60 * 60));
    let h = Math.floor(durationSecond % (24 * 60 * 60) / (60 * 60));
    let m = Math.floor(durationSecond % (24 * 60 * 60) % (60 * 60) / 60);
    let s = Math.floor(durationSecond % (24 * 60 * 60) % (60 * 60) % 60);

    if (index === 1) return d ? fixDigest(d.toString()) : '';
    if (index === 2) return fixDigest(h.toString());
    if (index === 3) return fixDigest(m.toString());
    if (index === 4) return fixDigest(s.toString());

    // 适用格式 小时：分：秒
    let _h = Math.floor(durationSecond / (60 * 60));
    let _m = Math.floor(durationSecond % (60 * 60) / 60);
    let _s = Math.floor(durationSecond % (60 * 60) % 60);

    if (index === 5) return fixDigest(_h.toString());
    if (index === 6) return fixDigest(_m.toString());
    if (index === 7) return fixDigest(_s.toString());

    return '无效时间';
  }
}
