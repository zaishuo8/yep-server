import { Controller } from 'egg';

export default class UserController extends Controller {

  /**
   * post
   * body: {phoneNumber: string}
   * return: boolean
   * */
  public async smsCode() {
    const { ctx } = this;
    ctx.validate({
      phoneNumber: { type: 'isPhoneNumber' },
    });

    ctx.body = true;
  }

  /**
   * 登录，未注册的直接注册
   * post
   * body: {phoneNumber: string, smsCode: string}
   * return: {
   *   result: boolean,
   *   userInfo: {User},
   *   token: string,
   *   withRegister: boolean(是否是注册的),
   * }
   * */
  public async login() {
    const { ctx } = this;

    ctx.validate({
      phoneNumber: { type: 'isPhoneNumber' },
      smsCode: { type: 'string' },
    });

    const { phoneNumber, smsCode } = ctx.request.body;
    ctx.body = await ctx.service.user.login(phoneNumber, smsCode);
  }

  /**
   * 关联/取消关联 用户 - 圈子 - 城市
   * post
   * body: {relation: boolean(关联、取消), cityIds: cityId[], communityIds: communityId[]}
   * return: boolean
   * */
  public async selectCityCommunity() {
    const { ctx } = this;

    ctx.validate({
      relation: { type: 'boolean' },
      cityIds: { type: 'array', itemType: 'number', required: false },
      communityIds: { type: 'array', itemType: 'number', required: false },
    });

    const { relation, cityIds, communityIds } = ctx.request.body;

    await ctx.service.user.selectCityCommunity(relation, cityIds, communityIds);

    ctx.body = true;
  }

  /**
   * 关注
   * post
   * body: {followerUserId: number, followedUserId: number}
   * */
  public async follow() {
    return null;
  }
}
