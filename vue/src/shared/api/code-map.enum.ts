export enum ApiError {
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
}

export const ApiErrorMessage: {[key: number]: string} = {
  [ApiError.ErrNeedToLogin]: '请登录',
  [ApiError.ErrUnauthorized]: '请登录',
  // [ApiError.ErrNotFound]: '资源不存在',
  [ApiError.ErrUserMobileAlreadyBinded]: '您已绑定过手机',
  [ApiError.ErrUserMobileUsedByOthers]: '手机已被其他用户绑定',
  [ApiError.ErrSigninInvalidPassword]: '手机号不存在或密码错误',
  [ApiError.ErrSigninInvalidSmsCode]: '验证码错误',
  [ApiError.ErrSigninEmptyPassword]: '密码未设置，请点忘记密码重置',
  [ApiError.ErrPleaseWaitAMoment]: '请求过于频繁，请稍后重试',
  [ApiError.ErrUnpay]: '请支付',
  [ApiError.ErrUnnecessaryToPay]: '无需支付',
  [ApiError.ErrUnknownPaymentPlatform]: '无法识别支付平台',
  [ApiError.ErrAlreadyPaid]: '订单已支付',
  [ApiError.ErrBillingClosed]: '订单已关闭',
  [ApiError.ErrInvalidActivateCode]: '激活码不存在，或者已被用过',
  [ApiError.ErrActivateCodeAlreadyUsed]: '激活码已被激活',
};

export const SigninErrorMessage = {
  [ApiError.ErrNotFound]: '手机号不存在',
  [ApiError.ErrSigninInvalidPassword]: '手机号不存在或验证码错误',
};
