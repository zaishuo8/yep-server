import { Controller } from 'egg';

export default class UserController extends Controller {

  /**
   * post
   * body: {phoneNumber: string}
   * return: boolean
   * */
  public async smsCode() {
    return null;
  }

  /**
   * 登录，未注册的直接注册
   * post
   * body: {phoneNumber: string, smsCode: string}
   * return: { result: boolean, withRegister: boolean(是否是注册的) }
   * */
  public async login() {
    return null;
  }

  /**
   * 关联/取消关联 用户 - 圈子 - 城市
   * post
   * body: {relation: boolean(关联、取消), cityIds: cityId[], communityIds: communityId[]}
   * return: boolean
   * */
  public async selectCityCommunity() {
    return null;
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
