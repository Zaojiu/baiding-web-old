// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const host = {
  self: '_REPL_SELF_HOST_',
  auth: '_REPL_AUTH_HOST_',
  io:  '_REPL_IO_HOST_',
  assets: '_REPL_ASSETS_HOST_',
  weinre: '',
};

export const appConfig = {
  host: host,
  name: '_REPL_SITE_NAME_',
  slogan: '_REPL_SLOGAN_',
  lcAppId: '_REPL_LEADCLOUD_ID_',
  lcAppKey: '_REPL_LEADCLOUD_APP_KEY_',
  wechatLink: '_REPL_WECHAT_LINK_',
  payAddress: '_REPL_WECHAT_PAY_ADDRESS_',
  iosDownloadLink: '_REPL_IOS_DOWNLOAD_LINK_',
  iosDownloadPage: '_REPL_IOS_DOWNLOAD_PAGE_',
};

export const environment = {
  production: true,
  config: appConfig,
};

