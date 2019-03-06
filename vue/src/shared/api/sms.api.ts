import { host } from "../../env/environment";
import { post } from "./xhr";

export enum SmsScene {
  Login = 1,
  ResetPassword,
  BindMobile,
  Signup
}

export enum SmsType {
  Text = 1,
  Voice
}
// 发送验证码
export const sendSmsByLoginUser = async (
  mobile: string,
  scene: SmsScene,
  type = SmsType.Text,
  codeMap?: { [key: number]: string }
): Promise<void> => {
  const url = `${host.io}/api/user/login/sms`;
  const data = {
    mobile: mobile,
    scene: scene,
    type: type
  };

  await post(url, data);

  return;
};
//发送短信验证码
export const sendSmsByGuest = async (
  mobile: string,
  scene: SmsScene,
  type = SmsType.Text,
  codeMap?: { [key: number]: string }
): Promise<void> => {
  const url = `${host.io}/api/user/login/sms`;
  const data = {
    mobile: mobile,
    scene: scene,
    type: type
  };

  await post(url, data, { codeMap: codeMap });

  return;
};
//手机验证码验证
export const validateSMSCode = async (
  phoneNumber: string,
  smsCode: string
): Promise<void> => {
  const url = `${host.io}/api/user/v2/validateSmsCode`;
  const data = { mobile: phoneNumber, smsCode: smsCode };
  await post(url, data);
  return;
};
