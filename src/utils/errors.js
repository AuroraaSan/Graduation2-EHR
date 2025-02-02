class BaseError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

class NotFoundError extends BaseError {
  constructor(details = null, message = 'Resource not found') {
    super(message, 404, details);
  }
}

class ValidationError extends BaseError {
  constructor(details = null, message = 'Validation failed') {
    super(message, 400, details);
  }
}

class UnauthorizedError extends BaseError {
  constructor(details = null, message = 'Unauthorized access') {
    super(message, 401, details);
  }
}

class ForbiddenError extends BaseError {
  constructor(details = null, message = 'Forbidden access') {
    super(message, 403, details);
  }
}

class InternalServerError extends BaseError {
  constructor(details = null, message = 'Internal server error') {
    super(message, 500, details);
  }
}

class ConflictError extends BaseError {
  constructor(details = null, message = 'Conflict error') {
    super(message, 409, details);
  }
}

export {
  BaseError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
  ConflictError,
};