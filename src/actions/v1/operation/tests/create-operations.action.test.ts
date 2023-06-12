import { createOperationHandler } from '../create-operation.action';
import OperationModel, { IOperationInterface } from '../../../../models/operation.model';
import DatabaseService from '../../../../services/database.service';
import { StatusCode } from '../../../../enums/status-code.enum';
import { ResponseMessage } from '../../../../enums/response-message.enum';

jest.mock('../../../../services/database.service');

describe('createOperationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new operation and return its id', async () => {
    const operation: IOperationInterface = {
      type: 'ADDITION',
      cost: 100,
      inputsNeeded: 2,
    };

    const operationModel = new OperationModel(operation);
    operationModel.toEntityMappings();

    DatabaseService.prototype.create = jest.fn().mockResolvedValue(null);

    const result = await createOperationHandler(operation);

    expect(DatabaseService.prototype.create).toBeCalledWith(
      expect.objectContaining({
        TableName: expect.any(String),
        Item: expect.objectContaining({
          id: expect.any(String),
          cost: operation.cost,
          inputsNeeded: operation.inputsNeeded,
          type: operation.type,
        }),
      }),
    );

    expect(result.code).toEqual(StatusCode.CREATED);
    expect(result.message).toEqual(ResponseMessage.CREATE_OPERATION_SUCCESS);
    expect(result.data).toHaveProperty('operationId');
  });

  test('should return CREATE_OPERATION_FAIL error if an error occurs', async () => {
    const operation: IOperationInterface = {
      type: 'ADDITION',
      cost: 100,
      inputsNeeded: 2,
    };

    DatabaseService.prototype.create = jest.fn().mockRejectedValue(new Error('Unexpected error'));

    const result = await createOperationHandler(operation);

    expect(result.code).toEqual(StatusCode.ERROR);
    expect(result.data).toEqual({});
    expect(result.message).toEqual(ResponseMessage.CREATE_OPERATION_FAIL);
  });
});
