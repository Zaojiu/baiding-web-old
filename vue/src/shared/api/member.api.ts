import {host} from "../../env/environment";
import {get, post} from "./xhr";
import {AxiosResponse} from "axios";
import {MemberRight, MemberRightsCode} from "./member.model";
import {params} from "../utils/utils";

export const activateMember = async (code: string, wechat: string, realname: string, company: string, position: string): Promise<void> => {
  const url = `${host.io}/api/user/member/activate`;
  const data = {code, wechat, realname, company, position};

  try {
    post(url, data);
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
  } catch(e) {
    return [];
  }

  const rights: MemberRight[] = [];
  const data = resp.data || [];
  data.forEach((rightData: any) => rights.push(new MemberRight(rightData)));

  return rights;
};

export const getMemberRight = async (id: string): Promise<MemberRight|null> => {
  const url = `${host.io}/api/wallet/discount/${id}`;

  let resp: AxiosResponse;
  try {
    resp = await get(url);
  } catch(e) {
    return null;
  }

  const data = resp.data;
  return new MemberRight(data);
};

export const listMemberRightsCode = async (discountId: string, onlyUnused = false, onlyUsed = false): Promise<MemberRightsCode[]> => {
  const url = `${host.io}/api/wallet/discount/code`;
  const query: {[key: string]: any} = {discountId};
  if (onlyUnused) query['unused'] = true;
  if (onlyUsed) query['used'] = true;

  let resp: AxiosResponse;
  try {
    resp = await get(`${url}?${params(query)}`);
  } catch(e) {
    return [];
  }

  const codes: MemberRightsCode[] = [];
  const data = resp.data && resp.data.result || [];
  const user = resp.data && resp.data.include && resp.data.include.users || {};
  data.forEach((codeData: any) => codes.push(new MemberRightsCode(codeData, user)));

  return codes;

};
