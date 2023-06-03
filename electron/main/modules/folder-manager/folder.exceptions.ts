export class FolderNotFoundException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'FolderNotFoundException';
		Object.setPrototypeOf(this, FolderNotFoundException.prototype);
	}
}
