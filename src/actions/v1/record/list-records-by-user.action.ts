import { QueryParams, wrapAsRequestWithAuth } from '../../../utils/lambda-handler';
import { StatusCode } from '../../../enums/status-code.enum';
import { ResponseMessage } from '../../../enums/response-message.enum';
import ResponseModel from '../../../models/response.model';
import { RecordService } from '../../../services/record.service';
import { Key } from 'aws-sdk/clients/dynamodb';

interface IGetAllRecordsInterface {
  user_id: string;
  limit?: number;
  exclusiveStartKey?: Key;
  filter?: string;
}

const listRecordsByUserHandler = async (_body: IGetAllRecordsInterface, context: any, _headers: any, queryParams: QueryParams): Promise<ResponseModel> => {
  try {
    const limit = 3;
    const user_id = context.user;
    const { filter, lastEvaluatedKey } = queryParams;

    const recordService = new RecordService();
    const result = await recordService.getAllRecordsByUserId(user_id, limit, lastEvaluatedKey ? (JSON.parse(lastEvaluatedKey) as Key) : undefined, filter);

    return new ResponseModel(result, StatusCode.OK, ResponseMessage.GET_RECORD_SUCCESS);
  } catch (error) {
    console.log(error);
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.GET_RECORD_FAIL);
  }
};

export const listRecordsByUserV1 = wrapAsRequestWithAuth(listRecordsByUserHandler);
