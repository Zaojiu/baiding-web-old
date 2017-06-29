import { ErrorHandler } from '@angular/core';
declare const window: any;

export class TrackJsErrorHandler implements ErrorHandler {
  handleError(error:any) {
    // Add the error message to the telemetry timeline.
    // It can occasionally have useful additional context.
    console.warn(error.message);

    // Assumes we have already loaded and configured TrackJS*
    if (window.trackJs) {
      window.trackJs.track(error.originalError); // Send the native error object to TrackJS
    }
  }
}

export default TrackJsErrorHandler;
