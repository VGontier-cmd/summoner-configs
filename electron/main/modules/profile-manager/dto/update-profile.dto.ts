import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @Length(36)
  @IsString()
  @IsUUID()
  id!: string;

  @Length(1, 20)
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Length(7)
  @IsNotEmpty()
  @IsString()
  color!: string;

  @IsNotEmpty()
  @IsBoolean()
  isFav!: boolean;
}
