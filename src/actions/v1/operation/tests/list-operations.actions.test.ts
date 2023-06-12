import { listOperationsHandler } from '../list-operations.action';
import DatabaseService from '../../../../services/database.service';
import { StatusCode } from '../../../../enums/status-code.enum';
import { ResponseMessage } from '../../../../enums/response-message.enum';

jest.mock('../../../../services/database.service');

describe('listOperationsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a list of operations', async () => {
    const operations = [
      {
        id: 'test-id',
        type: 'ADDITION',
        cost: 100,
        inputsNeeded: 2,
      },
    ];

    DatabaseService.prototype.scan = jest.fn().mockResolvedValue(operations);

    const result = await listOperationsHandler();

    expect(DatabaseService.prototype.scan).toBeCalledWith({
      TableName: expect.any(String),
    });

    expect(result.code).toEqual(StatusCode.OK);
    expect(result.message).toEqual(ResponseMessage.GET_OPERATION_SUCCESS);
    expect(result.data).toEqual(operations);
  });

  test('should return GET_OPERATION_FAIL error if an error occurs', async () => {
    DatabaseService.prototype.scan = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    const result = await listOperationsHandler();

    expect(result.code).toEqual(StatusCode.ERROR);
    expect(result.data).toEqual({});
    expect(result.message).toEqual(ResponseMessage.GET_OPERATION_FAIL);
  });
});
