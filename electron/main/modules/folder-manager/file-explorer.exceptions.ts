/**
 * Custom error class for indicating that a folder was not found.
 */
export class FolderNotFoundException extends Error {
	/**
	 * Creates an instance of `FolderNotFoundException`.
	 * @param {string} message - The error message.
	 */
	constructor(message: string) {
		super(message);
		this.name = 'FolderNotFoundException';
		Object.setPrototypeOf(this, FolderNotFoundException.prototype);
	}
}
