import {host as devHost, appConfig as devAppConfig, environment as devEnvironment} from './environment.development';
import {host as prodHost, appConfig as prodAppConfig, environment as prodEnvironment} from './environment.production';

let _host = devHost, _appConfig = devAppConfig, _environment = devEnvironment;

if (process.env.NODE_ENV === 'production') {
  _host = prodHost;
  _appConfig = prodAppConfig;
  _environment = prodEnvironment;
}

export const host = _host, appConfig = _appConfig, environment = _environment;
