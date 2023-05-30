import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsUUID()
  id!: string;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  color!: string;

  @IsOptional()
  @IsBoolean()
  isFav?: boolean;
}
