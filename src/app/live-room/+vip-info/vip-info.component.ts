import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {InviteApiService} from '../../shared/api/invite/invite.api';

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

  constructor(private route: ActivatedRoute, private router: Router, private inviteApiService: InviteApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    this.isLoading = false;
  }

  submit() {
    this.inviteApiService.getInvited(this.liveId, this.nameContent, this.introContent).then((model)=> {
      this.router.navigate(([`/lives/${this.liveId}/invitation`, {token: model.token}]));
    });
  }
}
