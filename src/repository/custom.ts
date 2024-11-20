import { Repository, SelectQueryBuilder, BaseEntity, FindOneOptions } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UserEntity } from "src/entity/User.entity";


export class CustomRepository<T extends BaseEntity> extends Repository<T> {
  
  /**
   * 更新该数值自增1
   */
  public async updateIncreaseOne(param:keyof T, position) {
    let count = (await this.findOne(position))[param]
    if(typeof count!='number') {
      throw new TypeError('得到的关键字并不是number类型')
    }
    await this.update(position,{
        [param]: count + 1
      } as any)
  }
}