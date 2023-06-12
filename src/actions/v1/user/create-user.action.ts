import 'source-map-support/register';

import UserModel, { IUserInterface } from '../../../models/user.model';
import ResponseModel from '../../../models/response.model';

import DatabaseService, { PutItem } from '../../../services/database.service';
import { databaseTables } from '../../../utils/util';

import { wrapAsRequest } from '../../../utils/lambda-handler';
import { StatusCode } from '../../../enums/status-code.enum';
import { ResponseMessage } from '../../../enums/response-message.enum';

const createUserHandler = async (body: IUserInterface): Promise<ResponseModel> => {
  try {
    const databaseService = new DatabaseService();

    const userModel = new UserModel(body);
    const data = userModel.toEntityMappings();
    const params: PutItem = {
      TableName: databaseTables().userTable,
      Item: data,
    };
    await databaseService.create(params);
    return new ResponseModel({ userId: data.id }, StatusCode.CREATED, ResponseMessage.CREATE_USER_SUCCESS);
  } catch (error) {
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.CREATE_USER_FAIL);
  }
};

export const createUserV1 = wrapAsRequest(createUserHandler);
