export class ProfileNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileNotFoundException';
    Object.setPrototypeOf(this, ProfileNotFoundException.prototype);
  }
}
