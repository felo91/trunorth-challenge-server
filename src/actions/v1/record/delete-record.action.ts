import 'source-map-support/register';

import { IRecordProps } from '../../../models/record.model';
import ResponseModel from '../../../models/response.model';

import DatabaseService, { UpdateItem } from '../../../services/database.service';
import { databaseTables } from '../../../utils/util';

import { ResponseMessage } from '../../../enums/response-message.enum';
import { StatusCode } from '../../../enums/status-code.enum';
import { QueryParams, wrapAsRequestWithAuth } from '../../../utils/lambda-handler';

const deleteRecordHandler = async (_body: IRecordProps, context: any, _headers: any, queryParams: QueryParams): Promise<ResponseModel> => {
  try {
    const databaseService = new DatabaseService();
    const user_id = context.user;
    const { recordTable } = databaseTables();
    const { id, operation_id } = queryParams;

    const record = await databaseService.getItem({
      key: id!,
      hash: 'operation_id',
      hashValue: operation_id!,
      tableName: recordTable,
    });

    if (record && record.Item?.user_id != user_id) {
      throw new ResponseModel({}, StatusCode.BAD_REQUEST, ResponseMessage.RECORD_NOT_FOUND);
    }

    const params: UpdateItem = {
      TableName: recordTable,
      Key: { id, operation_id },
      UpdateExpression: 'set #deleted = :deleted',
      ExpressionAttributeNames: { '#deleted': 'deleted' },
      ExpressionAttributeValues: { ':deleted': true },
      ReturnValues: 'UPDATED_NEW',
    };

    await databaseService.update(params);

    return new ResponseModel({}, StatusCode.OK, ResponseMessage.UPDATE_RECORD_SUCCESS);
  } catch (error) {
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.UPDATE_RECORD_FAIL);
  }
};

export const deleteRecordV1 = wrapAsRequestWithAuth(deleteRecordHandler);
