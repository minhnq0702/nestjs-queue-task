export const AccountsService = jest.fn().mockImplementation(() => ({
  pagination: jest.fn(),
  listAccounts: jest.fn(),
  getAccount: jest.fn(),
  createAccount: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccountById: jest.fn(),
  hashPassword: jest.fn(),
}));
