import { ItemList, Key } from 'aws-sdk/clients/dynamodb';

export interface PaginatedResult {
  items: ItemList;
  lastEvaluatedKey: Key | null;
}
