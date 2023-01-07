class ErrorException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errorObject?: Record<string, unknown>
  ) {
    super(message);
  }
}

export default ErrorException;
