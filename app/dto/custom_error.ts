/**
 * 自定义错误
 * */

interface CustomError {
  code: string;
  message: string;
}

export const loginExpireError: CustomError = {
  code: '-10010',
  message: '登陆过期',
};

export const smsCodeError: CustomError = {
  code: '-10020',
  message: '验证码错误',
};
