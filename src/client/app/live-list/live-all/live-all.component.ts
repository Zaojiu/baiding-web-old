import { Component, OnInit } from '@angular/core';
import { LiveInfoModel } from '../../shared/live/live.model';

@Component({
  moduleId: module.id,
  templateUrl: './live-all.component.html'
})

export class LiveAllComponent implements OnInit {
  lives: LiveInfoModel[];

  constructor() {}

  getLives() {
    // this.liveService.getLives().then(lives => this.lives = lives)
  }

  ngOnInit() {
    // this.getLives();
  }
}
