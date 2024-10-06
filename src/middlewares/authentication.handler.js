import createHttpError, { HttpError } from 'http-errors';
import jwt from 'jsonwebtoken';

import { isStringEmpty } from '../utils/index.js';
import { verifyUserToken } from '../utils/jwt.js';

const authenticationHandler = async (
  req,
  res,
  next,
  params = {
    required: false,
    role: [],
  }
) => {
  try {
    const userToken =
      req.cookies?.user_token ||
      req.headers.authorization?.replace('Bearer ', '');

    const refreshToken = req.cookies?.refresh_token;

    // console.log(req.headers['user-agent']);
    // console.log(req.headers['x-forwarded-for']);
    // console.log(req.ip);

    let user = res.locals.user || null;
    const role = params.role || [];

    const isUsedRole = role.length > 0;
    const isRequiredAuth = params.required || isUsedRole;

    const isExistToken =
      !isStringEmpty(refreshToken?.trim()) && refreshToken != undefined;

    if (isRequiredAuth && !isExistToken) {
      res.clearCookie('user_token', {
        ...req.session.cookie,
        domain: req.session.cookie.domain,
        httpOnly: req.session.cookie.httpOnly,
        sameSite: req.session.cookie.sameSite,
        secure: true,
      });

      return res.json({
        statusCode: 401,
        message: 'Token is required.',
      });
      // throw createHttpError.BadRequest('Token is required');
    }

    if (isExistToken && !user) {
      res.locals.userToken = userToken;

      user = await verifyUserToken(userToken, req, res, next);

      res.locals.user = user;
    }

    if (isRequiredAuth && !user) {
      throw createHttpError.Unauthorized(
        'You need authorized to perform this action.'
      );
    }

    if (isRequiredAuth && isUsedRole && user && !role.includes(user.role)) {
      throw createHttpError.Forbidden(
        'You do not have permission to perform this action.'
      );
    }

    return next();
  } catch (error) {
    if (error instanceof HttpError) {
      const statusCode = error?.statusCode || error?.status;

      // if (statusCode == 401 || statusCode == 403) {
      //   res.clearCookie('user_token', {
      //     ...(req.session.cookie as CookieOptions),
      //     domain: req.session.cookie.domain,
      //     httpOnly: req.session.cookie.httpOnly,
      //     sameSite: req.session.cookie.sameSite,
      //     secure: true
      //   });
      // }
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(
        createHttpError.Unauthorized(
          error?.message || error.name || 'Token is expired'
        )
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        createHttpError.Unauthorized(
          error?.message || error.name || 'Token is invalid'
        )
      );
    }

    next(error);
  }
};

export { authenticationHandler };
