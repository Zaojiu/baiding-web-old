import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config'
import { PostCommentModel } from './post-comment.model';

@Injectable()
export class PostCommentService {
  constructor (private http: Http, private config: AppConfig) {}

  postTextComment(liveId, content) {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${this.config.urlPrefix.io}/api/streams/${liveId}/messages`;
    let comment = new PostCommentModel();
    comment.type = 'text';
    comment.content = content;

    return this.http.post(url, JSON.stringify(comment), {headers: headers}).toPromise()
      .then(res => console.log(res); )
      .catch(res => {
          // TODO: error;
      });
  }
}
