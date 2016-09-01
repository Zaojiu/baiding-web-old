import { Injectable } from '@angular/core';

import { UrlPrefix } from './app.model';

@Injectable()
export class AppConfig {
  urlPrefix: UrlPrefix;

  constructor() {
    this.urlPrefix = new UrlPrefix();
    this.urlPrefix.auth = '/api/accountd';
    this.urlPrefix.io = '/api';
  }
}

