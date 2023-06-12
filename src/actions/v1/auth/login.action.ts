import 'source-map-support/register';

import UserModel, { IUserInterface } from '../../../models/user.model';
import ResponseModel from '../../../models/response.model';

import DatabaseService, { QueryItem } from '../../../services/database.service';
import { databaseTables } from '../../../utils/util';

import { wrapAsRequest } from '../../../utils/lambda-handler';
import { StatusCode } from '../../../enums/status-code.enum';
import { ResponseMessage } from '../../../enums/response-message.enum';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

interface ILoginInterface {
  username: string;
  password: string;
}

export const loginHandler = async (body: ILoginInterface): Promise<ResponseModel> => {
  try {
    const databaseService = new DatabaseService();

    const params: QueryItem = {
      TableName: databaseTables().userTable,
      IndexName: 'username_index',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': body.username,
      },
    };

    const result = await databaseService.query(params);

    if (!result.Items || result.Items.length === 0) {
      throw new ResponseModel({}, StatusCode.BAD_REQUEST, ResponseMessage.USER_NOT_FOUND);
    }

    const user = new UserModel(result.Items[0] as IUserInterface);
    if (!bcrypt.compareSync(body.password, user.password)) {
      throw new ResponseModel({}, StatusCode.BAD_REQUEST, ResponseMessage.INVALID_PASSWORD);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    return new ResponseModel({ userId: user.id, token }, StatusCode.OK, ResponseMessage.LOGIN_SUCCESS);
  } catch (error) {
    console.log(error);
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.LOGIN_FAIL);
  }
};

export const loginV1 = wrapAsRequest(loginHandler);
