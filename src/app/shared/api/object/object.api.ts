import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {environment} from "../../../../environments/environment";
import {ObjectModel} from "./object.model";

@Injectable()
export class ObjectService {
  constructor(private http: Http) {
  }

  getObject(id: string): Promise<ObjectModel> {
    const url = `${environment.config.host.io}/api/live/objects/${id}`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      return new ObjectModel(data);
    });
  }
}
