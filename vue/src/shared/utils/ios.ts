import {appendBeforeEachHook} from "../../hooks";

declare const window: any;

let jsBridge: any;
export const initIOS = (): Promise<void> => {
  if (jsBridge) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    if (window.WebViewJavascriptBridge) {
      jsBridge = window.WebViewJavascriptBridge;
      resolve();
      return;
    }

    window.WVJBCallbacks = [(bridge: any) => {
      jsBridge = bridge;
      resolve();
    }];

    const WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0);
  });
};

export const callHandler = (...args: any[]) => {
  if (!jsBridge) {
    throw new Error('must call initIOS at least once');
  }

  jsBridge.callHandler(...args);
};

export const copyText = (text: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    initIOS().then(() => {
      callHandler('copyText', {
        title: text,
      }, (result: any) => {
        resolve(result);
      }, (err: any) => {
        reject(err);
      });
    });
  });
};

export const pay = (wxPayRequests: any): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    initIOS().then(() => {
      callHandler('pay', wxPayRequests, (result: any) => {
        resolve(result);
      }, (err: any) => {
        reject(err);
      });
    });
  });
};
