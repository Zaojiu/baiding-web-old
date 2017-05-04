import axios from 'axios'
import auth from '../auth'

export const StatusContinue           = 100 // RFC 7231, 6.2.1
export const StatusSwitchingProtocols = 101 // RFC 7231, 6.2.2
export const StatusProcessing         = 102 // RFC 2518, 10.1

export const StatusOK                   = 200 // RFC 7231, 6.3.1
export const StatusCreated              = 201 // RFC 7231, 6.3.2
export const StatusAccepted             = 202 // RFC 7231, 6.3.3
export const StatusNonAuthoritativeInfo = 203 // RFC 7231, 6.3.4
export const StatusNoContent            = 204 // RFC 7231, 6.3.5
export const StatusResetContent         = 205 // RFC 7231, 6.3.6
export const StatusPartialContent       = 206 // RFC 7233, 4.1
export const StatusMultiStatus          = 207 // RFC 4918, 11.1
export const StatusAlreadyReported      = 208 // RFC 5842, 7.1
export const StatusIMUsed               = 226 // RFC 3229, 10.4.1

export const StatusMultipleChoices  = 300 // RFC 7231, 6.4.1
export const StatusMovedPermanently = 301 // RFC 7231, 6.4.2
export const StatusFound            = 302 // RFC 7231, 6.4.3
export const StatusSeeOther         = 303 // RFC 7231, 6.4.4
export const StatusNotModified      = 304 // RFC 7232, 4.1
export const StatusUseProxy         = 305 // RFC 7231, 6.4.5

export const StatusTemporaryRedirect = 307 // RFC 7231, 6.4.7
export const StatusPermanentRedirect = 308 // RFC 7538, 3

export const StatusBadRequest                   = 400 // RFC 7231, 6.5.1
export const StatusUnauthorized                 = 401 // RFC 7235, 3.1
export const StatusPaymentRequired              = 402 // RFC 7231, 6.5.2
export const StatusForbidden                    = 403 // RFC 7231, 6.5.3
export const StatusNotFound                     = 404 // RFC 7231, 6.5.4
export const StatusMethodNotAllowed             = 405 // RFC 7231, 6.5.5
export const StatusNotAcceptable                = 406 // RFC 7231, 6.5.6
export const StatusProxyAuthRequired            = 407 // RFC 7235, 3.2
export const StatusRequestTimeout               = 408 // RFC 7231, 6.5.7
export const StatusConflict                     = 409 // RFC 7231, 6.5.8
export const StatusGone                         = 410 // RFC 7231, 6.5.9
export const StatusLengthRequired               = 411 // RFC 7231, 6.5.10
export const StatusPreconditionFailed           = 412 // RFC 7232, 4.2
export const StatusRequestEntityTooLarge        = 413 // RFC 7231, 6.5.11
export const StatusRequestURITooLong            = 414 // RFC 7231, 6.5.12
export const StatusUnsupportedMediaType         = 415 // RFC 7231, 6.5.13
export const StatusRequestedRangeNotSatisfiable = 416 // RFC 7233, 4.4
export const StatusExpectationFailed            = 417 // RFC 7231, 6.5.14
export const StatusTeapot                       = 418 // RFC 7168, 2.3.3
export const StatusUnprocessableEntity          = 422 // RFC 4918, 11.2
export const StatusLocked                       = 423 // RFC 4918, 11.3
export const StatusFailedDependency             = 424 // RFC 4918, 11.4
export const StatusUpgradeRequired              = 426 // RFC 7231, 6.5.15
export const StatusPreconditionRequired         = 428 // RFC 6585, 3
export const StatusTooManyRequests              = 429 // RFC 6585, 4
export const StatusRequestHeaderFieldsTooLarge  = 431 // RFC 6585, 5
export const StatusUnavailableForLegalReasons   = 451 // RFC 7725, 3

export const StatusInternalServerError           = 500 // RFC 7231, 6.6.1
export const StatusNotImplemented                = 501 // RFC 7231, 6.6.2
export const StatusBadGateway                    = 502 // RFC 7231, 6.6.3
export const StatusServiceUnavailable            = 503 // RFC 7231, 6.6.4
export const StatusGatewayTimeout                = 504 // RFC 7231, 6.6.5
export const StatusHTTPVersionNotSupported       = 505 // RFC 7231, 6.6.6
export const StatusVariantAlsoNegotiates         = 506 // RFC 2295, 8.1
export const StatusInsufficientStorage           = 507 // RFC 4918, 11.5
export const StatusLoopDetected                  = 508 // RFC 5842, 7.2
export const StatusNotExtended                   = 510 // RFC 2774, 7
export const StatusNetworkAuthenticationRequired = 511 // RFC 6585, 6

export const defaults = {
  withCredentials: true
};

const interceptor = (forceAuth) => {
  return (error) => {
    if (error.response.status === StatusUnauthorized && forceAuth) {
      if (typeof forceAuth === 'string') {
        auth(forceAuth);
      } else {
        auth(location.href);
      }
    }

    return error;
  };
};

export default {
  get (url, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.get(url, Object.assign(defaults, config)).catch(interceptor(forceAuth));
  },
  post (url, data, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.post(url, data, Object.assign(defaults, config)).catch(interceptor(forceAuth));
  },
  put (url, data, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.put(url, data, Object.assign(defaults, config)).catch(interceptor(forceAuth));
  },
  delete (url, config) {
    const forceAuth = config ? config.forceAuth : false;
    return axios.delete(url, Object.assign(defaults, config)).catch(interceptor(forceAuth));
  },
}
