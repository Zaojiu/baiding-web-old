import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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
  user: UserDetailInfoModel;
  nameContent = '';
  introContent = '';
  uid: number;

  constructor(private http: Http, private route: ActivatedRoute, private router: Router,
              private fb: FormBuilder, private userInfoService: UserInfoService, private _location: Location) {
  }

  ngOnInit() {
    this.userInfoService.getUserInfo().then(userInfo => {
      this.userInfoService.getUserDetailInfo(userInfo.uid).then((user)=> {
        this.user = user;
        this.nameContent = this.user.nick;
        this.introContent = this.user.intro;
      });
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
    if (this.form.invalid) return
    this.postUserInfo();
  }

  postUserInfo() {
      let headers = new Headers({'Content-Type': 'application/json'});
      const url = `${environment.config.host.io}/api/user/detail`;
      let user = new UserInfoModel();
      user.nick = this.nameContent;
      user.intro = this.introContent;
      return this.http.put(url, JSON.stringify(user), {headers: headers}).toPromise().then((res)=> {
        this._location.back();
      });
  }
}
