import { IsBoolean, IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsHexColor()
  color!: string;

  @IsBoolean()
  isFav?: boolean;
}
