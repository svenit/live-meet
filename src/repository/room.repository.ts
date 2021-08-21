import { EntityRepository, Repository } from 'typeorm';

import { RoomEntity } from '@/entities';

@EntityRepository(RoomEntity)
export class RoomRepository extends Repository<RoomEntity> {
  async exists(fields: RoomEntity): Promise<RoomEntity> {
    return await this.findOne({
      where: Object.keys(fields).map((f) => ({ [f]: fields[f] })),
    });
  }
}
