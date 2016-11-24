import {UserInfoModel} from "../user-info/user-info.model";
export class PostApplicationModel {
  username: string;
  email: string;
  name: string;
  company: string;
  title: string;
  mobile: string;

  constructor(username: string, email: string, realName: string, company: string, title: string, phoneNumber: string) {
    this.username = username;
    this.email = email;
    this.name = realName;
    this.company = company;
    this.title = title;
    this.mobile = phoneNumber;
  }
}

export enum ApplicationStatus {
  Waitting = 0,
  Decline,
  Pass,
}

export class ApplicationModel {
  id: string;
  userInfo: UserInfoModel;
  username: string;
  realName: string;
  mobile: string;
  company: string;
  email: string;
  title: string;
  status: ApplicationStatus;
  createdAt: Moment;
  updatedAt: Moment;

  constructor(id: string, userInfo: UserInfoModel, username: string, realName: string,
              mobile: string, company: string, email: string, title: string, status: ApplicationStatus,
              createdAt: Moment, updatedAt: Moment) {
    this.id = id;
    this.userInfo = userInfo;
    this.username = username;
    this.realName = realName;
    this.mobile = mobile;
    this.company = company;
    this.email = email;
    this.title = title;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
