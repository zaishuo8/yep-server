import { Service } from 'egg';
import { Community } from '../model/community';

/**
 * Community Service
 */
export default class CommunityService extends Service {

  public async getAllCommunities(): Promise<Community[]> {
    return await this.ctx.model.Community.findAll({
      raw: true,
      attributes: [ 'id', 'name', 'img' ],
    });
  }
}
