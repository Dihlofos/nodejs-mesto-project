class CustomError extends Error {
  private statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default CustomError;
