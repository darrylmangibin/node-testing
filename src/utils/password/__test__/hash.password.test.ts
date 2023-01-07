import comparePassword from '../compare.password';
import hashPassword from '../hash.password';

describe('hashPassword', () => {
  it('should return hashed password', async () => {
    const password = '123456';
    const otherPassword = '123123';

    const hashed = await hashPassword(password);

    const isMatchPassword = await comparePassword(password, hashed);
    const notMatchPassword = await comparePassword(otherPassword, hashed);

    expect(typeof hashed).toBe('string');
    expect(isMatchPassword).toBe(true);
    expect(notMatchPassword).toBe(false);
  });
});
