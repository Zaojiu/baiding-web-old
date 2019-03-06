import {host} from "../../env/environment";
import {get, post} from "./xhr";
import {AxiosResponse} from "axios";
import {MemberRight} from "./member.model";
import {params} from "../utils/utils";
import {Discount} from "./order.model";
//会员相关接口
export const activateMember = async (code: string, wechat: string, realname: string, company: string, position: string): Promise<void> => {
  const url = `${host.io}/api/user/member/activate`;
  const data = {code, wechat, realname, company, position};

  try {
    await post(url, data);
  } catch (e) {
    throw e;
  }

  return;
};

export const listMemberRights = async (): Promise<MemberRight[]> => {
  const url = `${host.io}/api/wallet/discount`;

  let resp: AxiosResponse;
  try {
    resp = await get(url);
  } catch (e) {
    return [];
  }

  let rights: MemberRight[] = [];
  const data = resp.data || [];
  if (data.length) {
    rights = data.filter((r: any) => {
      return r.available > 0;
    }).map((r: any) => {
      return new MemberRight(r);
    });
  }

  return rights;
};

export const getMemberRight = async (id: string): Promise<MemberRight | null> => {
  const url = `${host.io}/api/wallet/discount/${id}`;

  let resp: AxiosResponse;
  try {
    resp = await get(url);
  } catch (e) {
    return null;
  }

  const data = resp.data;
  return new MemberRight(data);
};

export const listMemberRightsCode = async (discountId: string, onlyUnused = false, onlyUsed = false): Promise<Discount[]> => {
  const url = `${host.io}/api/wallet/discount/code`;
  const query: { [key: string]: any } = {discountId};
  if (onlyUnused) query['unused'] = true;
  if (onlyUsed) query['used'] = true;

  let resp: AxiosResponse;
  try {
    resp = await get(`${url}?${params(query)}`);
  } catch (e) {
    return [];
  }

  const codes: Discount[] = [];
  const data = resp.data && resp.data.result || [];
  const user = resp.data && resp.data.include && resp.data.include.users || {};
  data.forEach((codeData: any) => codes.push(new Discount(codeData, user)));

  return codes;
};
