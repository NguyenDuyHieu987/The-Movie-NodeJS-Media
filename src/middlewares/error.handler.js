import { isHttpError } from 'http-errors';

const errorHandler = (error, req, res, next) => {
  let statusCode = error?.status || error?.statusCode || 500;
  let errorMessage =
    error?.message || error?.body?.message || 'An unknown error occurred';

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  return res.status(statusCode).json({
    statusCode,
    message: errorMessage,
  });
};

export { errorHandler };
