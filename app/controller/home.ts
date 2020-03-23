import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async getAllCommunities() {
    const { ctx } = this;
    ctx.body = await ctx.model.Community.findAll();
  }

  /*
  public async insertCommunity() {
    const { ctx } = this;
    const { name, desc, img } = ctx.request.body;
    ctx.body = ctx.model.Community.create({ name, desc, img });
  }*/
}
