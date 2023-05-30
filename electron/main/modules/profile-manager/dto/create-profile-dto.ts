import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProfileDto {
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
  isFav?: boolean;
}
