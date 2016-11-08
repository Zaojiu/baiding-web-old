import { Injectable } from '@angular/core';

import { UrlPrefix } from './app.model';

@Injectable()
export class AppConfig {
  urlPrefix: UrlPrefix;
  lcAppId: string;
  lcAppKey: string;

  constructor() {
    this.urlPrefix = new UrlPrefix();
    this.urlPrefix.auth = 'http://auth.tengxunsb.io';
    this.urlPrefix.io = 'http://io.tengxunsb.io';
    this.lcAppId = "UGzbb42HlvESeNmziyhOWHsa-gzGzoHsz";
    this.lcAppKey = "dbbAJuix9SThsVPWMkNSAQ9d";
  }
}

