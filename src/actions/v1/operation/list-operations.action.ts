import 'source-map-support/register';

import { ResponseMessage } from '../../../enums/response-message.enum';
import { StatusCode } from '../../../enums/status-code.enum';
import ResponseModel from '../../../models/response.model';
import DatabaseService, { ScanInput } from '../../../services/database.service';
import { wrapAsRequestWithAuth } from '../../../utils/lambda-handler';
import { databaseTables } from '../../../utils/util';

export const listOperationsHandler = async (): Promise<ResponseModel> => {
  try {
    const databaseService = new DatabaseService();
    const { operationTable } = databaseTables();
    const params: ScanInput = {
      TableName: operationTable,
    };
    const operations = await databaseService.scan(params);

    return new ResponseModel(operations, StatusCode.OK, ResponseMessage.GET_OPERATION_SUCCESS);
  } catch (error) {
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.GET_OPERATION_FAIL);
  }
};

export const listOperationsV1 = wrapAsRequestWithAuth(listOperationsHandler);
