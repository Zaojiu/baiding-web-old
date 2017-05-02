let jsBridge;

class IosBridge {
  constructor() {};

  callHandler() {
    if (!jsBridge) return;

    jsBridge.callHandler(...arguments);
  }

  async getInstant() {
    if (jsBridge) return Promise(this);

    return new Promise((resolve, reject) => {
      if (window.WebViewJavascriptBridge) {
        jsBridge = window.WebViewJavascriptBridge;
        resolve(this);
        return;
      }

      window.WVJBCallbacks = [(bridge) => {
        jsBridge = bridge;
        resolve(this);
      }];

      const WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
      }, 0);
    });
  }
}

export default new IosBridge();
