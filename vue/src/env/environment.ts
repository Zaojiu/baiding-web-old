// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const host = {
  self: 'http://www.zaojiu.tv',
  auth: '//auth.zaojiu.tv',
  io: '//io.zaojiu.tv',
  assets: 'http://www.zaojiu.tv',
  weinre: 'http://192.168.1.203:10000',
};

export const appConfig = {
  host: host,
  name: '造就',
  slogan: '发现最有创造力的思想',
  lcAppId: 'UGzbb42HlvESeNmziyhOWHsa-gzGzoHsz',
  lcAppKey: 'dbbAJuix9SThsVPWMkNSAQ9d',
  wechatLink: 'http://weixin.qq.com/r/OkOrs7fEwOq-rfPQ9xYo',
  payAddress: '/wxpay/',
  iosDownloadLink: 'https://a.app.qq.com/o/ioslink.jsp?id=1190044215',
  iosDownloadPage: 'https://www.zaojiu.com/app',
};

export const environment = {
  production: false,
  development: true,
  config: appConfig,
};
