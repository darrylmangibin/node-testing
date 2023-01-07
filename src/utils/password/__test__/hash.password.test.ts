import comparePassword from '../compare.password';
import hashPassword from '../hash.password';

describe('hashPassword', () => {
  it('should return hashed password', async () => {
    const password = '123456';

    const hashed = await hashPassword(password);

    expect(typeof hashed).toBe('string');
  });
});
