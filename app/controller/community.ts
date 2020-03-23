import { Controller } from 'egg';

export default class CommunityController extends Controller {

  public async getAllCommunities() {
    const { ctx } = this;
    ctx.body = await ctx.service.community.getAllCommunities();
  }

}
