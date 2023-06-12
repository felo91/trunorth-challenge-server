import 'source-map-support/register';

import ResponseModel from '../../models/response.model';

import DatabaseService from '../../services/database.service';

import { ResponseMessage } from '../../enums/response-message.enum';
import { StatusCode } from '../../enums/status-code.enum';
import operationSeedData from '../../seeds/operation-seed.json';
import userSeedData from '../../seeds/user-seed.json';
import { wrapAsRequest } from '../../utils/lambda-handler';
import { databaseTables } from '../../utils/util';

const seedDataHanlder = async (): Promise<ResponseModel> => {
  try {
    const databaseService = new DatabaseService();
    const { userTable, operationTable } = databaseTables();

    const rest = await databaseService.getItem({
      key: '1',
      tableName: operationTable,
    });

    if (rest != null && rest.Item != null) {
      return new ResponseModel({}, StatusCode.ERROR, ResponseMessage.ALREADY_SEED);
    }

    const params = {
      [operationTable]: operationSeedData.map((item) => ({
        PutRequest: {
          Item: item,
        },
      })),
      [userTable]: userSeedData.map((item) => ({
        PutRequest: {
          Item: item,
        },
      })),
    };

    await databaseService.batchCreate({ RequestItems: params });
    return new ResponseModel({}, StatusCode.CREATED, ResponseMessage.SEED_SUCCESS);
  } catch (error) {
    return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.ERROR, ResponseMessage.SEED_FAIL);
  }
};

export const seedData = wrapAsRequest(seedDataHanlder);
