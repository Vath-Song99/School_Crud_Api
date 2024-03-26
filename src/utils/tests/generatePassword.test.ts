import bcrypt from 'bcrypt';
import { generatePassword } from '../JWT';
import APIError from '../../errors/apiError';
import { handleConnectToMongoServer } from '../mongoMemoryServer ';

handleConnectToMongoServer()

jest.mock('bcrypt', () => ({
  async hash(password: string, saltOrRounds: string | number): Promise<string> {
    // Mocking bcrypt.hash function
    return 'hashedPassword';
  },
}));

describe('generatePassword', () => {
  it('should generate password hash', async () => {
    const password = 'myPassword';
    const hashedPassword = await generatePassword(password);
    expect(hashedPassword).toEqual('hashedPassword');
  });

  it('should throw APIError if bcrypt throws an error', async () => {
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error('Bcrypt Error') as never);
    const password = 'myPassword';
    await expect(generatePassword(password)).rejects.toThrow(APIError);
  });
});
