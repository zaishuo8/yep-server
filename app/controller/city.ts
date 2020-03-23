import { Controller } from 'egg';

export default class CityController extends Controller {

  public async getAllCities() {
    const { ctx } = this;
    ctx.body = await ctx.service.city.getAllCities();
  }

}
