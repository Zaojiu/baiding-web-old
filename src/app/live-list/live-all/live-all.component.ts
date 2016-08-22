import { Component, OnInit } from '@angular/core';
import { LiveModel } from '../../shared/live.model';
import { LiveAllService } from './live-all.service';

@Component({
  providers: [ LiveAllService ],
  templateUrl: './live-all.component.html'
})

export class LiveAllComponent implements OnInit {
  lives: LiveModel[];

  constructor(private liveService: LiveAllService) {}

  getLives() {
    this.liveService.getLives().then(lives => this.lives = lives)
  }

  ngOnInit() {
    this.getLives();
  }
}
