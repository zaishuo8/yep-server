import { Service } from 'egg';
import { City } from '../model/city';

/**
 * City Service
 */
export default class CityService extends Service {

  public async getAllCities(): Promise<City[]> {
    return await this.ctx.model.City.findAll({
      raw: true,
      attributes: [ 'id', 'cityCode', 'name', 'img' ],
    });
  }
}
