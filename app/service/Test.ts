import { Service } from 'egg';
import { Community } from '../model/community';

/**
 * Test Service
 */
export default class Test extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  /*
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }*/

  public async sayHi() {
    const result: Community = this.ctx.model.Community.findOne();
    const { desc } = result;
    return desc;
  }
}
