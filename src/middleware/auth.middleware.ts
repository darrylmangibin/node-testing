import User from '@/resources/user/user.model';
import ErrorException from '@/utils/exceptions/error.exception';
import verifyToken from '@/utils/token/verify.token';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

export const validateToken = async (token: unknown) => {
  try {
    if (!token) {
      throw new ErrorException('Unauthorized. No token', 401);
    }

    if (typeof token === 'string') {
      const decoded = await verifyToken(token);

      if (decoded instanceof JsonWebTokenError) {
        throw new ErrorException('Unauthorized. Token error', 401);
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        throw new ErrorException('Unauthorized. No user', 401);
      }

      return user;
    } else {
      throw new ErrorException('Unauthorized. Invalid token type', 401);
    }
  } catch (error) {
    throw error;
  }
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: unknown;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const [_bearer, _token] = req.headers.authorization.split(' ');

      token = _token;
    }

    const user = await validateToken(token);

    req.user = user;
    global.AuthUser = () => user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
