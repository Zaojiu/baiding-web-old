import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {OperationTipsService} from "../../operation-tips/operation-tips.service";

@Injectable()
export class UploadApiService {
  private url = 'https://up.qbox.me';

  constructor(private http: Http, private operationTipsService: OperationTipsService) {
  }

  uploadToQiniu(file: File | Blob, key: string, token: string): Promise<string> {
    let form = new FormData();

    if (key) form.append("key", key);
    form.append('token', token);
    form.append('file', file);
    return this.http.post(this.url, form, {withCredentials: false}).toPromise().then((res) => {
      let data = res.json();
      let imageKey = data.key;
      return imageKey;
    }, (err) => {
      this.operationTipsService.popup('资源上传错误(文件大小超出限制)')
      return Promise.reject(err);
    });
  }
}
