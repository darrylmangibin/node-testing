import { Types } from 'mongoose';
import signToken from '../sign.token';
import verifyToken from '../verify.token';

describe('verifyToken', () => {
  it('should return the payload of the token', async () => {
    const id = new Types.ObjectId().toString();

    const token = signToken({ id });

    const decoded = (await verifyToken(token)) as AppPayload;

    expect(decoded.id).toEqual(id);
  });
});
