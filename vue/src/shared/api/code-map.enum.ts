export enum ApiCode {
  OK = 200,
  ErrNeedToLogin = 401,
  ErrNotFound = 404,
  ErrUnauthorized = 20001,
  ErrSigninEmptyPassword = 20100,
  ErrSigninInvalidPassword = 20101,
  ErrSigninInvalidSmsCode = 20102,
  ErrPleaseWaitAMoment = 200200,
  ErrUserMobileAlreadyBinded = 200201,
  ErrUserMobileUsedByOthers = 200202,
  ErrInvalidActivateCode = 200203,
  ErrActivateCodeAlreadyUsed = 200204,
  ErrUnpay = 400001,
  ErrUnnecessaryToPay = 400002,
  ErrUnknownPaymentPlatform = 400003,
  ErrAlreadyPaid = 400101,
  ErrBillingClosed = 400102,
  ErrUnknown = 90000,
}

export const ApiErrorMessage: {[key: number]: string} = {
  [ApiCode.ErrNeedToLogin]: '请登录',
  [ApiCode.ErrUnauthorized]: '请登录',
  // [ApiCode.ErrNotFound]: '资源不存在',
  [ApiCode.ErrUserMobileAlreadyBinded]: '您已绑定过手机',
  [ApiCode.ErrUserMobileUsedByOthers]: '手机已被其他用户绑定',
  [ApiCode.ErrSigninInvalidSmsCode]: '验证码错误',
  [ApiCode.ErrSigninEmptyPassword]: '密码未设置，请点忘记密码重置',
  [ApiCode.ErrPleaseWaitAMoment]: '请求过于频繁，请稍后重试',
  [ApiCode.ErrUnpay]: '请支付',
  [ApiCode.ErrUnnecessaryToPay]: '无需支付',
  [ApiCode.ErrUnknownPaymentPlatform]: '无法识别支付平台',
  [ApiCode.ErrAlreadyPaid]: '订单已支付',
  [ApiCode.ErrBillingClosed]: '订单已关闭',
  [ApiCode.ErrInvalidActivateCode]: '激活码不存在，或者已被用过',
  [ApiCode.ErrActivateCodeAlreadyUsed]: '激活码已被激活',
  [ApiCode.ErrUnknown]: '服务器错误',
};

export const SigninErrorMessage = {
  [ApiCode.ErrNotFound]: '手机号不存在',
  [ApiCode.ErrSigninInvalidPassword]: '手机号不存在或验证码错误',
};
