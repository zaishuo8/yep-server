import { Service } from 'egg';
import { smsCodeError } from '../dto/custom_error';
import { User } from '../model/user';
import { v4 as uuidv4 } from 'uuid';
import { CityUser } from '../model/city_user';
import { CommunityUser } from '../model/community_user';

/**
 * User Service
 */
export default class UserService extends Service {

  /**
   * 登陆
   */
  public async login(phoneNumber: string, smsCode: string) {
    let withRegister = false; // 是否新注册用户
    // 1. 校验验证码
    const smsCodeCheckResult = await this.smsCodeCheck(phoneNumber, smsCode);
    if (!smsCodeCheckResult) {
      throw smsCodeError;
    }
    // 2. 判断是否有该用户
    let user: User = await this.ctx.model.User.findOne({
      where: { phone: phoneNumber },
      raw: true,
    });
    if (!user) {
      // 3. 没有用户，先注册
      await this.ctx.model.User.create({
        phone: phoneNumber,
        name: `用户${phoneNumber.slice(-4)}`,
      });
      withRegister = true;
      user = await this.ctx.model.User.findOne({
        where: { phone: phoneNumber },
        raw: true,
      });
    }
    // 4. 登陆
    const token = await this.sessionLogin(user.id);
    return Object.assign({}, user, { token, withRegister });
  }

  /**
   * 校验验证码
   * */
  public async smsCodeCheck(phoneNumber: string, smsCode: string) {
    if (phoneNumber && smsCode) {
      return true;
    }
    return false;
  }

  /**
   * session 登陆态
   * */
  public async sessionLogin(userId: number) {
    const token = uuidv4();
    this.ctx.session[userId] = token;
    return token;
  }

  /**
   * 选择城市 圈子
   * */
  public async selectCityCommunity(relation: boolean, cityIds: number[], communityIds: number[]) {
    const userId = this.ctx.headers['x-application-user-id'];
    console.log(userId);

    if (relation) {
      const cityToFollow: CityUser[] = [];
      if (cityIds && cityIds.length > 0) {
        for (const cityId of cityIds) {
          cityToFollow.push({ cityId, userId });
        }
      }

      const communityToFollow: CommunityUser[] = [];
      if (communityIds && communityIds.length > 0) {
        for (const communityId of communityIds) {
          communityToFollow.push({ communityId, userId });
        }
      }

      await this.ctx.model.CityUser.bulkCreate(cityToFollow);
      await this.ctx.model.CommunityUser.bulkCreate(communityToFollow);
    } else {

      if (cityIds && cityIds.length > 0) {
        for (const cityId of cityIds) {
          await this.ctx.model.CityUser.destroy({ where: { userId, cityId } });
        }
      }

      if (communityIds && communityIds.length > 0) {
        for (const communityId of communityIds) {
          await this.ctx.model.CommunityUser.destroy({ where: { userId, communityId } });
        }
      }

    }
  }

  /**
   * 获取用户信息
   * */
  public async getUserInfo(id: number) {
    return await this.ctx.model.User.findByPk(id, { raw: true });
  }
}
