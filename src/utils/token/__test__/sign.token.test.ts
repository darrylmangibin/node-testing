import { Types } from 'mongoose';
import signToken from '../sign.token';

describe('signToken', () => {
  it('should return token', async () => {
    const id = new Types.ObjectId().toString();

    const token = signToken({ id });

    expect(typeof token).toBe('string');
  });
});
