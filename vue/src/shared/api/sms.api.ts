import {host} from "../../env/environment";
import {post} from "./xhr";

export enum SmsScene {
  Login = 1,
  ResetPassword,
  BindMobile,
  Signup,
}

export enum SmsType {
  Text = 1,
  Voice,
}

export const sendSmsByLoginUser = async (mobile: string, scene: SmsScene, type = SmsType.Text, codeMap?: { [key: number]: string }): Promise<void> => {
  const url = `${host.io}/api/user/sms`;
  const data = {
    mobile: mobile,
    scene: scene,
    type: type,
  };

  await post(url, data);

  return;
};

export const sendSmsByGuest = async (mobile: string, scene: SmsScene, type = SmsType.Text, codeMap?: { [key: number]: string }): Promise<void> => {
  const url = `${host.io}/api/user/login/sms`;
  const data = {
    mobile: mobile,
    scene: scene,
    type: type,
  };

  await post(url, data, {codeMap: codeMap});

  return;
};
