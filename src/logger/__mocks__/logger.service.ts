export const LoggerService = jest.fn().mockImplementation(() => {
  return {
    log: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
});
