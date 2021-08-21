import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoomDTO {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Length(1, 30)
  password?: string;
}
