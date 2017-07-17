declare const window: any;

class IosBridge {
  private jsBridge: any;

  constructor() {};

  callHandler(...args: any[]) {
    if (!this.jsBridge) {
      throw new Error('must call getInstant at least once');
    }

    this.jsBridge.callHandler(...args);
  }

  async getInstant(): Promise<IosBridge> {
    if (this.jsBridge) return Promise.resolve(this);

    return new Promise<IosBridge>((resolve, reject) => {
      if (window.WebViewJavascriptBridge) {
        this.jsBridge = window.WebViewJavascriptBridge;
        resolve(this);
        return;
      }

      window.WVJBCallbacks = [(bridge: any) => {
        this.jsBridge = bridge;
        resolve(this);
      }];

      const WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0);
    });
  }
}

export const iosBridge = new IosBridge();

export default iosBridge;
