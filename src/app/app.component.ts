import { Component } from '@angular/core';
import { LocalStorageService } from "angular2-localstorage/LocalStorageEmitter";
/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  selector: 'bd-app',
  templateUrl: 'app.component.html',
  providers: [
    LocalStorageService
  ]
})

export class AppComponent {
  constructor() {}
}
