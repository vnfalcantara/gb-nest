import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserBody {
  @IsNotEmpty()
  readonly name: string;

  @Matches('')
  readonly cpf: string;

  @IsEmail()
  readonly email: string;

  @MinLength(3)
  readonly password: string
}

export class User extends UserBody {
  _id?: string

  deleted?: boolean

  created_at?: Date

  updated_at?: Date
}

export class UserUpdate extends PartialType(User) {
}

