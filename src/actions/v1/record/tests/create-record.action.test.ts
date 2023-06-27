import { createRecordHandler } from '../create-record.action';
import DatabaseService from '../../../../services/database.service';
import { StatusCode } from '../../../../enums/status-code.enum';
import { ResponseMessage } from '../../../../enums/response-message.enum';
import { RecordService } from '../../../../services/record.service';

jest.mock('../../../../services/database.service');
jest.mock('../../../../services/operation.service');
jest.mock('../../../../services/record.service');

describe('CreateRecordHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return CREATE_RECORD_SUCCESS when record is created successfully', async () => {
    const body = {
      operation_id: 'operation-id',
      amount: [1, 2],
      user_id: 'user-id',
      user_balance: 20,
      operation_response: '3',
    };
    const context = { user: 'user-id' };

    const operationData = { Item: { type: 'ADDITION', cost: 5 } };
    DatabaseService.prototype.getItem = jest.fn().mockResolvedValue(operationData);

    const lastRecord = { user_balance: 20 };
    RecordService.prototype.getLastByUserId = jest.fn().mockResolvedValue(lastRecord);

    DatabaseService.prototype.create = jest.fn().mockResolvedValue(undefined);

    const result = await createRecordHandler(body, context);

    expect(result.code).toEqual(StatusCode.CREATED);
    expect(result.message).toEqual(ResponseMessage.CREATE_RECORD_SUCCESS);
  });

  test('should return CREATE_RECORD_FAIL error if an error occurs', async () => {
    const body = {
      operation_id: 'operation-id',
      amount: [1, 2],
      user_id: 'user-id',
      user_balance: 20,
      operation_response: '3',
    };
    const context = { user: 'user-id' };

    DatabaseService.prototype.getItem = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    const result = await createRecordHandler(body, context);

    expect(result.code).toEqual(StatusCode.ERROR);
    expect(result.message).toEqual(ResponseMessage.CREATE_RECORD_FAIL);
  });

  test('should return USER_CREDIT_NOT_ENOUGH error if user balance is less than operation cost', async () => {
    const body = {
      operation_id: 'operation-id',
      amount: [1, 2],
      user_id: 'user-id',
      user_balance: 20,
      operation_response: '3',
    };
    const context = { user: 'user-id' };

    const operationData = { Item: { type: 'ADDITION', cost: 50 } };
    DatabaseService.prototype.getItem = jest.fn().mockResolvedValue(operationData);

    const lastRecord = { user_balance: 20 };
    RecordService.prototype.getLastByUserId = jest.fn().mockResolvedValue(lastRecord);

    const result = await createRecordHandler(body, context);

    expect(result.code).toEqual(StatusCode.BAD_REQUEST);
    expect(result.message).toEqual(ResponseMessage.USER_CREDIT_NOT_ENOUGH);
  });

  //TODO add more tests
});
