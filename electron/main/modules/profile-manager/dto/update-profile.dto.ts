import { IsBoolean, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

/**
 * Data transfer object for updating a profile.
 */
export class UpdateProfileDto {
	/**
	 * ID of the profile to update.
	 * @remarks Must be a non-empty string.
	 * @remarks Must have a length of 36 characters.
	 * @remarks Must be a valid UUID format.
	 * @example "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
	 */
	@IsNotEmpty()
	@Length(36)
	@IsString()
	@IsUUID()
	id!: string;

	/**
	 * Updated name of the profile.
	 * @remarks Must be a non-empty string.
	 * @remarks Must have a length between 1 and 20 characters.
	 * @example "John Doe"
	 */
	@Length(1, 20)
	@IsNotEmpty()
	@IsString()
	name!: string;
}
