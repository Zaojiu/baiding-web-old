import {LiveStatus} from './live.enums';
import {UserInfoModel} from '../user-info/user-info.model';
import {UserAnimEmoji} from '../../praised-animation/praised-animation.model';

export class LiveInfoModel {
  id: string;
  subject: string;
  desc: string;
  coverUrl: string;
  kind: string;
  status: LiveStatus;
  isDraft: boolean;
  owner: UserInfoModel;
  admin: UserInfoModel;
  editors: UserInfoModel[];
  praised: number;
  commented: number;
  niced: number;
  shared: number;
  lcConvId: string;
  hadPraised: boolean;
  praisedAnimations: UserAnimEmoji[] = [];
  expectStartAt: string;
  expectDuration: number;
  startedAt: string;
  closedAt: string;
  createdAt: string;
  onlines: number;

  isCreated(): boolean {
    return this.status == LiveStatus.Created;
  }

  isStarted(): boolean {
    return this.status == LiveStatus.Started;
  }

  isClosed(): boolean {
    return this.status == LiveStatus.Ended;
  }
}
