import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, Matches, Min, MinLength } from 'class-validator';

export class PurchaseBody {
  @IsNotEmpty()
  readonly code: string;

  @Min(0)
  readonly price: number;
}

export class Purchase extends PurchaseBody {
  _id?: string

  status?: string

  cashback?: number

  cashbackValue?: number

  user?: string

  deleted?: boolean

  created_at?: Date

  updated_at?: Date
}

export class PurchaseUpdate extends PartialType(Purchase) {
}

