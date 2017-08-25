import {host} from "../../env/environment";
import {post} from "./xhr";

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
