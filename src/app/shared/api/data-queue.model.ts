import {LiveInfoModel} from "./live/live.model";
import {TalkInfoModel} from "./talk/talk.model";
import {UserInfoModel} from "./user-info/user-info.model";
import {Response} from "@angular/http";

export class DataQueue {
  private _isLock = false;
  private _resolve: ((liveInfo: LiveInfoModel|TalkInfoModel|UserInfoModel) => void)[] = [];
  private _reject: ((resp: Response) => void)[] = [];

  lock() {
    this._isLock = true;
  }

  unlock() {
    this._isLock = false;
  }

  get isLock() {
    return this._isLock;
  }

  append(resolve: (liveInfo: LiveInfoModel|TalkInfoModel|UserInfoModel) => void, reject: (resp: Response) => void) {
    this._resolve.push(resolve);
    this._reject.push(reject);
  }

  resolve(liveInfo: LiveInfoModel|TalkInfoModel|UserInfoModel) {
    let resolve: (liveInfo: LiveInfoModel|TalkInfoModel|UserInfoModel) => void = this._resolve.shift();
    while (resolve) {
      this._reject.shift();
      resolve(liveInfo);
      resolve = this._resolve.shift()
    }
  }

  reject(resp: Response) {
    let reject: (resp: Response) => void = this._reject.shift();
    while (reject) {
      this._resolve.shift();
      reject(resp);
      reject = this._reject.shift();
    }
  }
}
