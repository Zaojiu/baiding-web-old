import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {CustomHttp} from "../custom-http.service";
import {OrderModel} from "./order.model";
import {host} from "../../../../environments/environment";

@Injectable()
export class OrderApiService {
  constructor(private http: CustomHttp) {
  }

  getOrderData(oid: string): Promise<OrderModel> {
    const url = `${host.io}/api/wallet/order/${oid}`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      return new OrderModel(data.order);
    });
  }
}
