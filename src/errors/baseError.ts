export class BaseError extends Error {
  constructor(public error: string, public message: string) {
    super(message)
  }
}