import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UploadApiService {
  private url = 'https://up.qbox.me';

  constructor (private http: Http) {}

  uploadToQiniu(file: File, data: any): Promise<string> {
    let form = new FormData();

    form.append("key", data.key);
    form.append('token', data.token);
    form.append('file', file);

    return this.http.post(this.url, form, {withCredentials: false}).toPromise().then(
      (res) =>{
        let data = res.json();
        let imageKey = data.key;
        return imageKey;
      }
    );

  }
}
