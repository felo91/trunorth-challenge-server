import 'source-map-support/register';

import RecordModel, { IRecordProps } from '../../../models/record.model';
import ResponseModel from '../../../models/response.model';

import DatabaseService, { PutItem } from '../../../services/database.service';
import { databaseTables } from '../../../utils/util';

import { wrapAsRequestWithAuth } from '../../../utils/lambda-handler';
import { StatusCode } from '../../../enums/status-code.enum';
import { ResponseMessage } from '../../../enums/response-message.enum';
import OperationModel, { IOperationInterface } from '../../../models/operation.model';
import { makeOperation } from '../../../services/operation.service';
import { RecordService } from '../../../services/record.service';

export const createRecordHandler = async (body: IRecordProps, context: any): Promise<ResponseModel> => {
  try {
    const databaseService = new DatabaseService();
    body.user_id = context.user;

    const operationData = await databaseService.getItem({
      key: body.operation_id!,
      tableName: databaseTables().operationTable,
    });

    const operation = new OperationModel(operationData.Item as IOperationInterface);
    body.operation_response = String(
      await makeOperation({
        type: operation.type,
        amounts: body.amount,
      }),
    );

    const recordService = new RecordService();
    const lastRecord = await recordService.getLastByUserId(context.user);
    body.user_balance = lastRecord ? lastRecord.user_balance! - operation.cost : 15 - operation.cost;

    if (body.user_balance < 0) {
      throw new ResponseModel({}, StatusCode.BAD_REQUEST, ResponseMessage.USER_CREDIT_NOT_ENOUGH);
    }
    const recordModel = new RecordModel(body);
    const data = recordModel.toEntityMappings();

    const params: PutItem = {
      TableName: databaseTables().recordTable,
      Item: data,
    };
    await databaseService.create(params);

    return new ResponseModel(
      {
        user_balance: data.user_balance,
        operation_response: data.operation_response,
      },
      StatusCode.CREATED,
      ResponseMessage.CREATE_RECORD_SUCCESS,
    );
  } catch (error) {
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.CREATE_RECORD_FAIL);
  }
};

export const createRecordV1 = wrapAsRequestWithAuth(createRecordHandler);
