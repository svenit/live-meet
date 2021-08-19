import { Same } from '@/decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
export class LoginDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class SingupDTO {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username format is invalid',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(2, 80)
  fullName: string;

  @Length(6, 30)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Same('password')
  confirmPassword: string;
}
