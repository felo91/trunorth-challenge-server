import 'source-map-support/register';

import OperationModel, { IOperationInterface } from '../../../models/operation.model';
import ResponseModel from '../../../models/response.model';

import DatabaseService, { PutItem } from '../../../services/database.service';
import { databaseTables } from '../../../utils/util';

import { wrapAsRequest } from '../../../utils/lambda-handler';
import { StatusCode } from '../../../enums/status-code.enum';
import { ResponseMessage } from '../../../enums/response-message.enum';

export const createOperationHandler = async (body: IOperationInterface): Promise<ResponseModel> => {
  try {
    const databaseService = new DatabaseService();

    const operationModel = new OperationModel(body);
    const data = operationModel.toEntityMappings();
    const params: PutItem = {
      TableName: databaseTables().operationTable,
      Item: data,
    };
    await databaseService.create(params);
    return new ResponseModel({ operationId: data.id }, StatusCode.CREATED, ResponseMessage.CREATE_OPERATION_SUCCESS);
  } catch (error) {
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.CREATE_OPERATION_FAIL);
  }
};

export const createOperation = wrapAsRequest(createOperationHandler);
