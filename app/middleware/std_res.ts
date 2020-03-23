/**
 * 标准返回
 * {
 *   code: '10000',
 *   message: null,
 *   result: true,
 * }
 * {
 *   code: '-10010',
 *   message: '登陆过期',
 *   result: null,
 * }
 * */
import { paramsCheckError } from '../dto/custom_error';

module.exports = () => {
  return async function stdRes(ctx, next) {
    try {
      await next();
      const result = ctx.body;
      ctx.body = {
        code: '10000',
        message: null,
        result,
      };
    } catch (e) {

      console.error(e);

      if (e.code === 'invalid_param') {
        // validate 统一的错误返回
        ctx.body = paramsCheckError;
      } else {
        ctx.body = {
          code: e.code || '-10000',
          message: e.message || '未知错误',
          result: null,
        };
      }
    }
  };
};
