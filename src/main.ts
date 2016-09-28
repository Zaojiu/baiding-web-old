import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/';

console.timeEnd('script before angular start');

platformBrowserDynamic().bootstrapModule(AppModule);
