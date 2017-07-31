import {sampleSize} from 'lodash';

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

export const isInWechat = /micromessenger/i.test(navigator.userAgent);
export const isiOS = /iPhone|iPad/i.test(navigator.userAgent);
export const isInApp = /zaojiuliveapp/i.test(navigator.userAgent);
export const isTouchable = (<any>window).DocumentTouch && document instanceof DocumentTouch;
export const isAndroid = /Android/i.test(navigator.userAgent);
export const isOnLargeScreen = matchMedia && matchMedia('(min-width: 1024px)').matches;
export const isChrome = /Chrome/i.test(navigator.userAgent);
export const isWindowsWechat = /WindowsWechat/i.test(navigator.userAgent);
export const now = (): number => Math.floor((new Date()).getTime() / 1000);
export const isViewportLandscape = (): boolean => {
  return window.matchMedia && matchMedia('(orientation: landscape)').matches;
};
export const parseAt = (content: string, needHeightLight = false): string => {
  const patt = /(@.+?)(\((.+?)\)){1}/g
  let result = null;
  let _content = content;

  while ((result = patt.exec(content)) != null) {
    if (needHeightLight) {
      _content = _content.replace(result[0], `<span class="highlight">${result[1]}</span>`)
    } else {
      _content = _content.replace(result[0], result[1])
    }
  }

  return _content
};
export const resetWindowScroll = (): void => {
  setTimeout(() => document.body.scrollTop = document.body.scrollHeight, 800);
};
export const parseUrl = (url: string): UrlModel => {
  const aEle = document.createElement('a');
  aEle.href = url;
  return new UrlModel(aEle.protocol, aEle.host, aEle.hostname, +aEle.port, aEle.pathname, aEle.search, aEle.hash)
};
export const params = (obj: Object): string => {
  return Object.keys(obj).map((k: string) => encodeURIComponent(k) + '=' + encodeURIComponent((<any>obj)[k])).join('&')
};
export const randomId = (size = 10, dic?: string): string => {
  const defaultDic = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return sampleSize((dic || defaultDic).split(''), size).join('')
};
export const absUrl = (path: string, query?: {[key: string]: string}): string => {
  let url = `${location.protocol}//${location.hostname}${path}`;
  if (query) url += `?${params(query)}`;
  return url;
};
