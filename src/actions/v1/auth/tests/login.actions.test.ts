const mockBcrypt = { compareSync: jest.fn(), hashSync: jest.fn() };
const mockJwt = { sign: jest.fn() };

import { loginHandler } from '../login.action';
import ResponseModel from '../../../../models/response.model';
import DatabaseService from '../../../../services/database.service';
import { StatusCode } from '../../../../enums/status-code.enum';
import { ResponseMessage } from '../../../../enums/response-message.enum';

jest.mock('bcryptjs', () => mockBcrypt);
jest.mock('jsonwebtoken', () => mockJwt);
jest.mock('../../../../services/database.service');

describe('LoginHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw USER_NOT_FOUND error if username does not exist', async () => {
    DatabaseService.prototype.query = jest.fn().mockResolvedValue({ Items: [] });

    const result = await loginHandler({ username: 'test', password: 'password' });

    const expected = new ResponseModel({}, StatusCode.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND);
    expect(result.code).toEqual(expected.code);
    expect(result.data).toEqual(expected.data);
    expect(result.message).toEqual(expected.message);
  });

  test('should throw INVALID_PASSWORD error if password does not match', async () => {
    mockBcrypt.compareSync.mockReturnValue(false);
    DatabaseService.prototype.query = jest.fn().mockResolvedValue({
      Items: [
        {
          username: 'test',
          password: 'hashed_password',
        },
      ],
    });

    const result = await loginHandler({ username: 'test', password: 'wrong_password' });

    const expected = new ResponseModel({}, StatusCode.BAD_REQUEST, ResponseMessage.INVALID_PASSWORD);
    expect(result.code).toEqual(expected.code);
    expect(result.data).toEqual(expected.data);
    expect(result.message).toEqual(expected.message);
  });

  test('should return response with token if user credentials are correct', async () => {
    mockBcrypt.compareSync.mockReturnValue(true);
    mockJwt.sign.mockReturnValue('token');
    DatabaseService.prototype.query = jest.fn().mockResolvedValue({
      Items: [
        {
          username: 'test',
          password: 'hashed_password',
          id: 'userId',
        },
      ],
    });

    const result = await loginHandler({ username: 'test', password: 'password' });

    expect(result.code).toEqual(StatusCode.OK);
    expect(result.message).toEqual(ResponseMessage.LOGIN_SUCCESS);
    expect(result.data).toHaveProperty('token');
    expect(result.data).toHaveProperty('userId');
  });

  test('should return LOGIN_FAIL error if an unexpected error occurs', async () => {
    DatabaseService.prototype.query = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    const result = await loginHandler({ username: 'test', password: 'password' });

    const expected = new ResponseModel({}, StatusCode.ERROR, ResponseMessage.LOGIN_FAIL);
    expect(result.code).toEqual(expected.code);
    expect(result.data).toEqual(expected.data);
    expect(result.message).toEqual(expected.message);
  });

  test('should return LOGIN_FAIL error if username is empty', async () => {
    const result = await loginHandler({ username: '', password: 'password' });

    const expected = new ResponseModel({}, StatusCode.ERROR, ResponseMessage.LOGIN_FAIL);
    expect(result.code).toEqual(expected.code);
    expect(result.data).toEqual(expected.data);
    expect(result.message).toEqual(expected.message);
  });

  test('should return LOGIN_FAIL error if password is empty', async () => {
    const result = await loginHandler({ username: 'test', password: 'password' });

    const expected = new ResponseModel({}, StatusCode.ERROR, ResponseMessage.LOGIN_FAIL);
    expect(result.code).toEqual(expected.code);
    expect(result.data).toEqual(expected.data);
    expect(result.message).toEqual(expected.message);
  });
});
