import {host} from '../../env/environment';
import {get, post, del} from "./xhr";
import {Discount, Order, OrderFee, OrderMeta, PostOrderObject} from "./order.model";
import {params} from "../utils/utils";
import axios from 'axios';
axios.defaults.withCredentials = true;
// 个人所有订单
export const listOrders = async (showItems = true, last?: string): Promise<{ orders: Order[], last: string }> => {
  const url = `${host.io}/api/wallet/order`;
  const query = {showItems, last};
  // const resp = await get(`${url}?${params(query)}`);
  const resp = await post(`${host.io}/api/order/orderList`);
  const orders: Order[] = [];
  const data = resp.data && resp.data.orders || [];
  const _last = resp.data && resp.data.last || '';
  data.forEach((orderData: any) => orders.push(new Order(orderData)));

  return {orders: orders, last: _last};
};

export const getOrder = async (orderNo: string, showItems = true, showDiscounts = true): Promise<Order> => {
  const url = `${host.io}/api/wallet/order/${orderNo}`;
  // const url = `http://www.zaojiu.fm/assets/order_detail.json`;
  const query = {showItems, showDiscounts};
  const res = await get(`${url}?${params(query)}`);
  return new Order(res.data);
};
// 创建订单
export const createOrder = async (objects: PostOrderObject[], discounts: string[] = [], needHandleError = true, cashbackId = ''): Promise<OrderMeta> => {
  let url = '';
  if (cashbackId) {
    let query = {
      cashbackId
    };
    url = `${host.io}/api/wallet/order?${params(query)}`;
    // url = `http://www.zaojiu.fm/assets/order.json`;
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
// 取消订单
export const closeOrder = async (orderNo: string): Promise<void> => {
  const url = `${host.io}/api/wallet/order/${orderNo}`;
  await del(url);
  return;
};
// 询价
export const checkOrderFee = async (objects: PostOrderObject[], discounts: string[] = [], buy = false, needHandleError = true): Promise<OrderFee> => {
  const url = `${host.io}/api/wallet/order/ready`;
  // const url = `http://www.zaojiu.fm/assets/ready.json`;
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



// 询价接口
export const crReady =async ( query: any) => {
  let succ = await post(`${host.io}/api/iap/ready`, query )
  return succ.data.results;
};
// 创建订单
export const crOrder =async ( query: any) => {

  let succ = await post(`${host.io}/api/iap/createOrder`, query );
  return succ.data.results;
};

// 取消订单
export const canceOrder =async ( query: any) => {

  let succ = await post(`${host.io}/api/order/cancelOrder?orderNo=${query}`);
  return succ.data.results;
};
// /api/order/orderDetail?orderNo=G20180903204303000001
// 订单详情
export const orderDetail = async ( query: any) => {

  let succ = await post(`${host.io}/api/order/orderDetail?orderNo=${query}`);
  return succ.data.results;
};

// 新订单列表
// state 订单生成(0),支付成功(1),处理完成(2),处理失败(-1)
export const orderList =async () => {
  let succ = await post(`${host.io}/api/order/orderList`);
  return succ.data.results;
};
