import { Component, OnInit }      from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// import { HistoryService } from './history.service';
// import { HistoryCommentModel } from './history.model';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';

@Component({
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  // providers: [ HistoryService ]
})

export class HistoryComponent implements OnInit {
  id: string;
  token: string;
  liveInfo: LiveInfoModel;
  // historyComments: HistoryCommentModel[];
  constructor(private liveService: LiveService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.parent.snapshot.params['id'];
    this.token = this.route.parent.snapshot.params['token'];

    // this.historyService.getHistory('13213213').then(historyComments => {
    //   this.historyComments = historyComments;
    // });

    if (!this.liveInfo) {
      this.liveService.getLiveInfo(this.id).then(info => this.liveInfo = info);
    }
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.id]);
  }
}
