/**
 * Represents a profile.
 */
export interface Profile {
	/**
	 * Unique identifier of the profile.
	 * @example "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
	 */
	id: string;

	/**
	 * Name of the profile.
	 * @example "John Doe"
	 */
	name: string;

	/**
	 * Color associated with the profile.
	 * @example "#FF0000"
	 */
	color: string;

	/**
	 * Indicates whether the profile is marked as a favorite.
	 * @example true
	 */
	isFav: boolean;
}
