// 验证是否是正确手机号
export function isMobileNumber(num: string): boolean {
  return /^1\d{10}$/.test(num);
}
