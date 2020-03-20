// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportLoginAuth from '../../../app/middleware/login_auth';
import ExportStdRes from '../../../app/middleware/std_res';

declare module 'egg' {
  interface IMiddleware {
    loginAuth: typeof ExportLoginAuth;
    stdRes: typeof ExportStdRes;
  }
}
