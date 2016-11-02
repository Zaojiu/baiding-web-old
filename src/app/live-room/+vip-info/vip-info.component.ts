import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {InviteApiService} from '../../shared/api/invite/invite.api';
import {TimelineService} from '../../live-room/timeline/timeline.service';
import {Location} from '@angular/common';
import {MqEvent, EventType} from '../../shared/mq/mq.service';

@Component({
  templateUrl: 'vip-info.component.html',
  styleUrls: ['vip-info.component.scss'],
  providers: [InviteApiService]
})

export class VipInfoComponent implements OnInit {
  liveId: string;
  token: string;
  isLoading: boolean;
  nameContent = '';
  introContent = '';
  unreadCount = 0;


  constructor(private route: ActivatedRoute, private router: Router, private inviteApiService: InviteApiService,
              private timelineService: TimelineService, private _location: Location) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    setTimeout(() => {
      return this.inviteApiService.getInviteToken(this.liveId).then((token)=> {
        this.token = token;
      });
    }, 0);


    this.timelineService.startReceive(this.liveId);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEventsReturn(evt));

    this.isLoading = false;
  }


  onReceivedEventsReturn(evt: MqEvent) {
    if (evt.event === EventType.LiveMsgUpdate) {
      this.unreadCount++;
    }
  }

  navigateBack() {
    this._location.back();
  }

  goToInvitation() {
    let query: any = {};
    query.token = this.token;
    this.router.navigate(([`/lives/${this.liveId}/invitation`, query]));
  }

  submit() {
    this.inviteApiService.getInvited(this.liveId, this.nameContent, this.introContent);

  }

}
