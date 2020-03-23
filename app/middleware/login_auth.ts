/**
 * 检验登录态，未登录直接抛登陆过期
 * header: { 'x-application-user-id', 'x-application-token' }
 * */
import { loginExpireError } from '../dto/custom_error';

module.exports = () => {
  return async function loginAuth(ctx, next) {
    const token = ctx.headers['x-application-token'];
    const userId = ctx.headers['x-application-user-id'];

    console.log(ctx.request.path);
    console.log(ctx.app.config.loginAuth.whiteList);

    if (
      (ctx.app.config.loginAuth.whiteList.includes(ctx.request.path))
      ||
      (token && (ctx.session[userId] === token))
    ) {
      await next();
    } else {
      throw loginExpireError;
    }
  };
};
