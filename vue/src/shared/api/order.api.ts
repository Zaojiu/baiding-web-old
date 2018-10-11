import {host} from '../../env/environment';
import {get, post, del} from "./xhr";
import {Discount, Order, OrderFee, OrderMeta, PostOrderObject} from "./order.model";
import {params} from "../utils/utils";

export const listOrders = async (showItems = true, last?: string): Promise<{ orders: Order[], last: string }> => {
  const url = `${host.io}/api/wallet/order`;
  const query = {showItems, last};
  const resp = await get(`${url}?${params(query)}`);

  const orders: Order[] = [];
  const data = resp.data && resp.data.orders || [];
  const _last = resp.data && resp.data.last || '';
  data.forEach((orderData: any) => orders.push(new Order(orderData)));

  return {orders: orders, last: _last};
};

export const getOrder = async (orderNo: string, showItems = true, showDiscounts = true): Promise<Order> => {
  const url = `${host.io}/api/wallet/order/${orderNo}`;
  const query = {showItems, showDiscounts};
  const res = await get(`${url}?${params(query)}`);
  return new Order(res.data);
};

export const createOrder = async (objects: PostOrderObject[], discounts: string[] = [], needHandleError = true, cashbackId = ''): Promise<OrderMeta> => {
  let url = '';
  if (cashbackId) {
    let query = {
      cashbackId
    };
    url = `${host.io}/api/wallet/order?${params(query)}`;
  } else {
    url = `${host.io}/api/wallet/order`;
  }
  const data = {
    items: objects || [],
    discounts,
  };
  const res = await post(url, data, {needHandleError: needHandleError});

  return new OrderMeta(res.data);
};

export const closeOrder = async (orderNo: string): Promise<void> => {
  const url = `${host.io}/api/wallet/order/${orderNo}`;
  await del(url);
  return;
};

export const checkOrderFee = async (objects: PostOrderObject[], discounts: string[] = [], buy = false, needHandleError = true): Promise<OrderFee> => {
  const url = `${host.io}/api/wallet/order/ready`;
  const query = {
    items: objects || [],
    discounts,
    buy,
  };
  const res = await post(url, query, {needHandleError});
  return new OrderFee(res.data);
};

export const listDiscountCode = async (objects: PostOrderObject[]): Promise<Discount[]> => {
  const url = `${host.io}/api/wallet/order/discount`;
  const query = {
    items: objects || [],
  };
  const resp = await post(url, query);
  const codes: Discount[] = [];
  const data = resp.data && resp.data.result || [];
  const user = resp.data && resp.data.include && resp.data.include.users || {};
  data.forEach((codeData: any) => codes.push(new Discount(codeData, user)));

  return codes;
};
