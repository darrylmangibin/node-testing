import bcrypt from 'bcryptjs';

import comparePassword from '../compare.password';

describe('comparePassword', () => {
  it('should return true when entered password and hashed is match', async () => {
    const password = '123456';

    const hashed = await bcrypt.hash(password, 10);

    expect(await comparePassword(password, hashed)).toBeTruthy();
  });

  it('should return false when no params inserted or entered password and hashed is not match', async () => {
    const password = '123456';
    const otherPassword = 'asdasd123v';

    const hashed = await bcrypt.hash(password, 10);

    expect(await comparePassword(otherPassword, hashed)).toBeFalsy();
    expect(await comparePassword()).toBeFalsy();
  });
});
