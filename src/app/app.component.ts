import {Component, OnInit} from '@angular/core';

declare var $:any;

@Component({
  selector: 'bd-app',
  templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    let $window = $(window);

    $window.on('resize', () => {
      setTimeout(()=> {
        const top = $window.height() - $window[0].innerHeight;
        $window.scrollTop(top);
      }, 4000);
    });
  }
}
