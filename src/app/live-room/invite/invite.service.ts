import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { HistoryCommentModel } from './history.model'

@Injectable()
export class HistoryService {
  private url: string = '../../../assets/mock-data/history.json';
  constructor (private http: Http) {}

  getHistory(id: string): Promise<HistoryCommentModel[]> {
    return this.http.get(this.url).toPromise()
      .then(response => response.json().result as HistoryCommentModel[]);
      // .catch(this.handleError);
  }
}
