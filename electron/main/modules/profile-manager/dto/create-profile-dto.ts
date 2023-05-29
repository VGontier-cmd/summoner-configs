import { IsBoolean, IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  gameSettingsFilePath!: string;

  @IsNotEmpty()
  @IsString()
  keybindsFilePath!: string;

  @IsNotEmpty()
  @IsString()
  persistedSettingsFilePath!: string;

  @IsNotEmpty()
  @IsHexColor()
  color!: string;

  @IsBoolean()
  isFav?: boolean;
}
