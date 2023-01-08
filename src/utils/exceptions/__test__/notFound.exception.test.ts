import ErrorException from '../error.exception';
import notFoundException from '../notFound.exception';

describe('notFoundException', () => {
  it('should throw not found error 404', async () => {
    try {
      notFoundException();
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Record not found',
          statusCode: 404,
        })
      );
    }
  });

  it('should return the custom message', async () => {
    const message = 'User not found';

    try {
      notFoundException(message);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ErrorException);
      expect(error.message).toEqual(message);
    }
  });
});
