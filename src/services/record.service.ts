import DatabaseService, { QueryItem } from '../services/database.service';
import { databaseTables } from '../utils/util';
import RecordModel, { IRecordInterface } from '../models/record.model';
import { ItemList, Key } from 'aws-sdk/clients/dynamodb';

export class RecordService {
  databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getAllRecordsByUserId(
    user_id: string,
    limit?: number,
    startKey?: Key,
    searchString?: string | undefined,
  ): Promise<{
    records: IRecordInterface[] | undefined;
    lastEvaluatedKey: Key | undefined;
    totalItems: number;
  }> {
    let params: QueryItem = {
      TableName: databaseTables().recordTable,
      IndexName: 'user_id_date_index',
      KeyConditionExpression: 'user_id = :user_id',
      FilterExpression: 'deleted = :deleted',
      ExpressionAttributeValues: {
        ':user_id': user_id,
        ':deleted': false,
      },
      ScanIndexForward: false,
      Limit: limit || 3,
      ExclusiveStartKey: startKey || undefined,
    };

    if (searchString) {
      params.FilterExpression += ' and contains(operation_id, :searchString) or contains(amount, :searchString) or contains(user_balance, :searchString) or contains(operation_response, :searchString)';
      params.ExpressionAttributeValues![':searchString'] = searchString;
    }

    let resultItems: ItemList = [];
    let lastEvaluatedKey: Key | undefined = undefined;
    let totalItems: number = 0;

    do {
      const records = await this.databaseService.query(params);

      lastEvaluatedKey = records.LastEvaluatedKey || undefined;
      resultItems.push(...(records.Items || []));
      totalItems += records.Count || 0;

      params.ExclusiveStartKey = lastEvaluatedKey!;
    } while (lastEvaluatedKey && resultItems.length < params.Limit!);

    resultItems = resultItems.slice(0, params.Limit);

    let records = resultItems.map((item) => new RecordModel(item as unknown as IRecordInterface).toEntityMappings());

    return { records, lastEvaluatedKey, totalItems };
  }

  async getLastByUserId(user_id: string): Promise<IRecordInterface | null> {
    const params: QueryItem = {
      TableName: databaseTables().recordTable,
      IndexName: 'user_id_date_index',
      KeyConditionExpression: 'user_id = :user_id',
      ExpressionAttributeValues: {
        ':user_id': user_id,
      },
      ScanIndexForward: false, // For descending order by date
      Limit: 1,
    };

    const result = await this.databaseService.query(params);

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const record = new RecordModel(result.Items[0] as IRecordInterface);
    return record.toEntityMappings();
  }
}
