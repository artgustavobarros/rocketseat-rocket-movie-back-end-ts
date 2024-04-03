export class UserNotFoundError extends Error {
  constructor() {
    super('User cannot be found.')
  }
}
