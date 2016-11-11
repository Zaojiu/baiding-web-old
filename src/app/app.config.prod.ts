export class UrlPrefix {
  auth = '<% AUTH_HOST %>';
  io = '<% IO_HOST %>';
}

export class AppConfig {
  host = new UrlPrefix;
  lcAppId = '<% LEADCLOUD_ID %>';
  lcAppKey = '<% LEADCLOUD_KEY %>';
}

