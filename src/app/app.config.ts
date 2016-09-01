import { Injectable } from '@angular/core';

import { UrlPrefix } from './app.model';

@Injectable()
export class AppConfig {
  urlPrefix: UrlPrefix;

  constructor() {
    this.urlPrefix = new UrlPrefix();
    this.urlPrefix.auth = 'http://auth.zaojiu.io';
    this.urlPrefix.io = 'http://io.zaojiu.io';
  }
}

