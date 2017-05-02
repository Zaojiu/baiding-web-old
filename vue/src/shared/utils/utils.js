import _ from 'lodash'

export class UrlModel {
  constructor (protocol, host, hostname, port, pathname, search, hash) {
    this.protocol = protocol
    this.host = host
    this.hostname = hostname
    this.port = port
    this.pathname = pathname
    this.search = search
    this.hash = hash
  }
}

export const Utils = {
  isInWechat: /micromessenger/i.test(window.navigator.userAgent),
  isiOS: /iPhone|iPad/i.test(window.navigator.userAgent),
  isInApp: /zaojiuliveapp/i.test(window.navigator.userAgent),
  isInBaidingApp: /baidingapp\.com/i.test(location.hostname),
  isTouchable: window.DocumentTouch && document instanceof DocumentTouch,
  isAndroid: /Android/i.test(window.navigator.userAgent),
  isOnLargeScreen: matchMedia && matchMedia('(min-width: 1022px)').matches,
  isChrome: /Chrome/i.test(window.navigator.userAgent),

  setStorage (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  getStorage (key) {
    return JSON.parse(localStorage.getItem(key)) || {}
  },

  now () {
    return Math.floor((new Date()).getTime() / 1000)
  },

  parseAt (content, needHeightLight = false) {
    const patt = /(@.+?)(\((.+?)\)){1}/g
    let result = null
    let _content = content

    while ((result = patt.exec(content)) != null) {
      if (needHeightLight) {
        _content = _content.replace(result[0], `<span class="highlight">${result[1]}</span>`)
      } else {
        _content = _content.replace(result[0], result[1])
      }
    }

    return _content
  },

  resetWindowScroll () {
    setTimeout(() => {
      document.body.scrollTop = document.body.scrollHeight
    }, 800)
  },

  parseUrl (url) {
    const aEle = document.createElement('a')
    aEle.href = url
    return new UrlModel(aEle.protocol, aEle.host, aEle.hostname, +aEle.port, aEle.pathname, aEle.search, aEle.hash)
  },

  params (obj) {
    return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
  },

  randomId (size = 10, dic) {
    const defaultDic = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return _.sampleSize((dic || defaultDic).split(''), size).join('')
  },

  absUrl (path, query) {
    let url = `${location.protocol}//${location.hostname}${path}`;
    if (query) url += `?${this.params(query)}`;
    return url;
  }
}
