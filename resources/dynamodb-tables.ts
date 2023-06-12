export default {
  OperationTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Delete",
    Properties: {
      TableName: "${self:provider.environment.OPERATION_TABLE}",
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.tableThroughput}",
        WriteCapacityUnits: "${self:custom.tableThroughput}",
      },
    },
  },
  UserTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Delete",
    Properties: {
      TableName: "${self:provider.environment.USER_TABLE}",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "username", AttributeType: "S" }
      ],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.tableThroughput}",
        WriteCapacityUnits: "${self:custom.tableThroughput}",
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: "username_index",
          KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
          Projection: {
            ProjectionType: "ALL", 
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.tableThroughput}",
            WriteCapacityUnits: "${self:custom.tableThroughput}",
          },
        },
      ],
    },
  },
  RecordTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Delete",
    Properties: {
      TableName: "${self:provider.environment.RECORD_TABLE}",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "operation_id", AttributeType: "S" },
        { AttributeName: "user_id", AttributeType: "S" },
        { AttributeName: "date", AttributeType: "N" }
      ],
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
        { AttributeName: "operation_id", KeyType: "RANGE" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.tableThroughput}",
        WriteCapacityUnits: "${self:custom.tableThroughput}",
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: "user_id_date_index",
          KeySchema: [
            { AttributeName: "user_id", KeyType: "HASH" },
            { AttributeName: "date", KeyType: "RANGE" } 
          ],
          Projection: {
            ProjectionType: "ALL", 
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.tableThroughput}",
            WriteCapacityUnits: "${self:custom.tableThroughput}",
          },
        },
      ],
    },
  },
};
