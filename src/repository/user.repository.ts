import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '@/entities';
import { UserDTO } from '@/api/auth/auth.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByUserName(username: string): Promise<any> {
    return await this.findOne({ username });
  }
  async exists(fields: UserDTO): Promise<any> {
    return await this.findOne({
      where: Object.keys(fields).map((f) => ({ [f]: fields[f] })),
    });
  }
}
