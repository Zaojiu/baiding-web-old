import {Component, Input} from '@angular/core';

@Component({
  selector: 'playing-btn',
  templateUrl: './playing-btn.component.html',
  styleUrls: ['./playing-btn.component.scss'],
})

export class PlayingBtnComponent {
  @Input() audioDuration: number;

  constructor() {}
}
