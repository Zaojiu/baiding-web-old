import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";

import {LiveInfoModel} from "../../shared/api/live/live.model";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {UserInfoModel, UserDetailInfoModel} from "../../shared/api/user-info/user-info.model";
import {Headers, Http} from "@angular/http";
import {environment} from "../../../environments/environment";
import {Location} from '@angular/common';

@Component({
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss'],
})

export class EditInfoComponent implements OnInit {
  liveId: string;
  liveInfo: LiveInfoModel;
  form: FormGroup;
  maxTitleLength = 30;
  maxDescLength = 150;
  userInfo: UserInfoModel;
  userDetailInfo: UserDetailInfoModel;
  nameContent = '';
  introContent = '';

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private userInfoService: UserInfoService, private _location: Location) {
  }

  ngOnInit() {
    this.userInfo = this.route.snapshot.data['userInfo'];

    this.userInfoService.getUserDetailInfo().then((user)=> {
      this.userDetailInfo = user;
      this.nameContent = this.userDetailInfo.nick;
      this.introContent = this.userDetailInfo.intro;
    });

    this.form = this.fb.group({
      'nameContent': new FormControl(this.nameContent, [
        Validators.required,
        Validators.maxLength(this.maxTitleLength)
      ]),
      'introContent': new FormControl(this.introContent, [
        Validators.maxLength(this.maxDescLength)
      ]),
    });
  }

  backToViewInfo() {
    this._location.back();
  }

  submit() {
    if (this.form.invalid) return;

    this.userInfoService.postUserInfo(this.nameContent, this.introContent).then(()=> {
      this.router.navigate([`/info-center/${this.userInfo.uid}`]);
    });
  }
}
