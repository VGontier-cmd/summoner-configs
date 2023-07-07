/**
 * Exception thrown when a profile is not found.
 */
export class ProfileNotFoundException extends Error {
	/**
	 * Creates a new instance of ProfileNotFoundException.
	 * @param message - The error message.
	 */
	constructor(message: string) {
		super(message);
		this.name = 'ProfileNotFoundException';
		Object.setPrototypeOf(this, ProfileNotFoundException.prototype);
	}
}
