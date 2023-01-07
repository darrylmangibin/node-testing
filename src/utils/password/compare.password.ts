import bcrypt from 'bcryptjs';

const comparePassword = async (
  enteredPassword?: string,
  hashedPassword?: string
): Promise<boolean> => {
  try {
    if (!enteredPassword || !hashedPassword) {
      return false;
    }

    return await bcrypt.compare(enteredPassword, hashedPassword);
  } catch (error) {
    throw error;
  }
};

export default comparePassword;
