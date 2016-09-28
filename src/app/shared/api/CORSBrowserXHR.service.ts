import { NgModule, Injectable } from '@angular/core';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class CORSBrowserXHR extends BrowserXhr{
  build(): any{
    var xhr:any = super.build();
    xhr.withCredentials = true;
    return xhr;
  }
}
