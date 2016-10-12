import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-waving-progress',
  templateUrl: './waving-progress.component.html',
  styleUrls: ['./waving-progress.component.scss']
})
export class WavingProgressComponent {
  @Input() playing: boolean;
  linesHeight = [1, 3, 1, 3, 5, 11, 5, 15, 17, 5, 21, 11, 15, 3, 21, 23, 21, 15, 21, 21, 11,
    11, 9, 5, 23, 27, 23, 21, 31, 27, 11, 31, 15, 11, 23, 21, 15, 21, 31, 5, 11, 15,
    11, 31, 17, 9, 5, 17, 15, 15, 11, 11, 3, 5, 5, 5, 3, 1];

}
