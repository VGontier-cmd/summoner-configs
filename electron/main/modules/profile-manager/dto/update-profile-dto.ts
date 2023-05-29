import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  gameSettingsFilePath!: string;

  @IsOptional()
  @IsString()
  keybindsFilePath!: string;

  @IsOptional()
  @IsString()
  persistedSettingsFilePath!: string;

  @IsOptional()
  @IsString()
  color!: string;

  @IsOptional()
  @IsBoolean()
  isFav?: boolean;
}
