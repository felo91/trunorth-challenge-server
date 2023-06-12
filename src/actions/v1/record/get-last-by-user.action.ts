import { wrapAsRequestWithAuth } from '../../../utils/lambda-handler';
import { StatusCode } from '../../../enums/status-code.enum';
import { ResponseMessage } from '../../../enums/response-message.enum';
import ResponseModel from '../../../models/response.model';
import { RecordService } from '../../../services/record.service';

const getLastRecordHandler = async (_body: never, context: any): Promise<ResponseModel> => {
  try {
    const recordService = new RecordService();
    const record = await recordService.getLastByUserId(context.user);

    if (record === null) {
      throw new ResponseModel({}, StatusCode.BAD_REQUEST, ResponseMessage.RECORD_NOT_FOUND);
    }

    return new ResponseModel(record, StatusCode.OK, ResponseMessage.GET_RECORD_SUCCESS);
  } catch (error) {
    console.log(error);
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.GET_RECORD_FAIL);
  }
};

export const getLastRecord = wrapAsRequestWithAuth(getLastRecordHandler);
