import ErrorException from './error.exception';

const notFoundException = (message?: string) => {
  throw new ErrorException(message || 'Record not found', 404);
};

export default notFoundException;
