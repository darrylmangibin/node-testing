import jwt from 'jsonwebtoken';

const verifyToken = async (token: string): Promise<AppPayload | jwt.VerifyErrors> => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) reject(err);

      resolve(payload as AppPayload);
    });
  });
};

export default verifyToken;
