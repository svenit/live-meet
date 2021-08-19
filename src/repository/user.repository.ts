import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '@/entities';
import { User } from '@/types';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByUserName(username: string): Promise<UserEntity> {
    return await this.findOne({ username });
  }
  async exists(fields: User): Promise<UserEntity> {
    return await this.findOne({
      where: Object.keys(fields).map((f) => ({ [f]: fields[f] })),
    });
  }
}
