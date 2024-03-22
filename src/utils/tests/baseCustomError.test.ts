import { BaseCustomError } from '../../errors/baseCustomError';

describe('BaseCustomError', () => {
  it('should create an instance of BaseCustomError', () => {
    const errorMessage = 'Test error message';
    const statusCode = 500;
    const error = new BaseCustomError(errorMessage, statusCode);

    expect(error instanceof BaseCustomError).toBe(true);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(statusCode);
    expect(error.name).toBe('BaseCustomError');
  });

  it('should capture stack trace', () => {
    const errorMessage = 'Test error message';
    const statusCode = 500;
    const error = new BaseCustomError(errorMessage, statusCode);

    expect(error.stack).toBeDefined();
  });

  it('should capture stack trace with specified constructor', () => {
    const errorMessage = 'Test error message';
    const statusCode = 500;
    const error = new BaseCustomError(errorMessage, statusCode);

    // Check that the constructor name is captured in the stack trace
    expect(error.stack).toContain('BaseCustomError');
  });
});
