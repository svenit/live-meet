import { UserRoomEntity } from '@/entities';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserRoomEntity)
export class UserRoomRepository extends Repository<UserRoomEntity> {
  async exists(fields: UserRoomEntity): Promise<UserRoomEntity> {
    return await this.findOne({
      where: Object.keys(fields).map((f) => ({ [f]: fields[f] })),
    });
  }
}
