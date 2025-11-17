export class Exception extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'Exception'
  }
}

export class BadRequestException extends Exception {
  constructor(message: string, data?: unknown) {
    super(400, message, data)
  }
}

export class UnauthorizedException extends Exception {
  constructor(message: string, data?: unknown) {
    super(401, message, data)
  }
}

export class ForbiddenException extends Exception {
  constructor(message: string, data?: unknown) {
    super(403, message, data)
  }
}

export class NotFoundException extends Exception {
  constructor(message: string, data?: unknown) {
    super(404, message, data)
  }
}

export class InternalServerError extends Exception {
  constructor(message: string) {
    super(500, message)
  }
}
