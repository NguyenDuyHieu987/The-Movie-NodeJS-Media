import { isHttpError } from 'http-errors';

const ErrorHandler = (error, req, res, next) => {
  let statusCode = error?.status || error?.statusCode || 500;
  let errorMessage =
    error?.message || error?.body?.message || 'An unknown error occurred';

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  return res.status(statusCode).json({
    status: statusCode,
    message: errorMessage,
  });
};

export default ErrorHandler;
