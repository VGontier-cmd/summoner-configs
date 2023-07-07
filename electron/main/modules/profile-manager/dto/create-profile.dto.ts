import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * Data transfer object for creating a profile.
 */
export class CreateProfileDto {
	constructor(profile: CreateProfileDto) {
		this.name = profile.name;
		this.color = profile.color || '#000000';
		this.isFav = profile.isFav || false;
	}
	/**
	 * Name of the profile.
	 * @remarks Must be a non-empty string.
	 * @remarks Must have a length between 1 and 20 characters.
	 * @example "John Doe"
	 */
	@Length(1, 20)
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	/**
	 * Color of the profile.
	 * @remarks Must be a non-empty string.
	 * @remarks Must have a length of 7 characters.
	 * @example "#FF0000"
	 */
	@Length(7)
	@IsString()
	readonly color: string;

	/**
	 * Flag indicating whether the profile is a favorite.
	 * @remarks Must be a boolean value.
	 * @example true
	 */
	@IsBoolean()
	readonly isFav: boolean;
}
