export class SentryAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryAPIError";
  }
}

export class SentryFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryFrontendError";
  }
}
