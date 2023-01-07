import jwt from 'jsonwebtoken';
import 'dotenv/config';

const signToken = (payload: AppPayload, options?: jwt.SignOptions): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '30d',
    ...options,
  });

  return token;
};

export default signToken;
