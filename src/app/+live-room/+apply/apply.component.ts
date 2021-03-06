import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {RegexpConst} from "../../shared/utils/regexp";
import {ApplyApiService} from "../../shared/api/apply/apply.service";
import {ApplicationModel, ApplicationStatus} from "../../shared/api/apply/apply.model";
import {apiValidator} from "../../shared/form/api.validator";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {UtilsService} from "../../shared/utils/utils";

@Component({
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})

export class ApplyComponent implements OnInit {
  form: FormGroup;
  username = '';
  email = '';
  realName = '';
  company = '';
  title = '';
  phoneNumber = '';
  submitted = false;
  isSubmitting = false;
  userInfo: UserInfoModel;
  application: ApplicationModel;
  applicationStatus = ApplicationStatus;
  loading = true;
  from = '';
  isInApp = UtilsService.isInApp;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private applyService: ApplyApiService, private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.userInfo = this.userInfoService.getUserInfoCache();
    this.from = this.route.snapshot.params['from'] ? this.route.snapshot.params['from'] : '';

    this.applyService.getApplication().then(application => {
      this.application = application;
    }).finally(() => {
      this.loading = false;
    });

    let fg = {
      'email': new FormControl(this.email, [
        Validators.required,
        Validators.pattern(RegexpConst.email),
      ]),
      'realName': new FormControl(this.realName, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      'company': new FormControl(this.company, [
        Validators.required,
      ]),
      'title': new FormControl(this.title, [
        Validators.required,
      ]),
      'phoneNumber': new FormControl(this.phoneNumber, [
        Validators.required,
        Validators.pattern(RegexpConst.mobile),
      ]),
    };

    let validateUserName = (val: string): Promise<void> => {
      return this.userInfoService.verifyUsername(val);
    };

    if (this.userInfo.username) {
      fg['username'] = new FormControl({value: this.userInfo.username, disabled: true}, []);
    } else {
      fg['username'] = new FormControl(this.username, [
        Validators.required,
        Validators.pattern(RegexpConst.username),
      ], [
        apiValidator(validateUserName),
      ]);
    }

    this.form = this.fb.group(fg);
    this.username = this.userInfo.username ? this.userInfo.username : '';
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.postApplication();
  }

  postApplication() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    this.applyService.postApplication(this.username, this.email, this.realName, this.company, this.title, this.phoneNumber).then(application => {
      this.application = application;
      this.submitted = true;
    }).finally(() => {
      this.isSubmitting = false;
    });
  }

  back() {
    if (this.from) {
      this.router.navigateByUrl(this.from);
    } else {
      this.router.navigate([`/info-center/${this.userInfo.uid}`]);
    }
  }

  gotoCreate() {
    this.router.navigate([`/lives/create`]);
  }

  canDeactivate() {
    return !this.form.dirty || this.submitted;
  }
}
