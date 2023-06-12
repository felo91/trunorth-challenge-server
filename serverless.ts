import type { AWS } from "@serverless/typescript";
import dynamoDbTables from "./resources/dynamodb-tables";
import functions from "./resources/functions";

const serverlessConfiguration: AWS = {
  service: "math",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-dynamodb-local",
    "serverless-offline",
    "serverless-plugin-subscription-filter",
    "serverless-plugin-aws-alerts",
    "serverless-dotenv-plugin"
  ],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    stage: "dev",
    runtime: "nodejs16.x",
    region: "us-east-2",
    logs: {
      restApi: {
        accessLogging: true,
        format: `{
"stage" : "$context.stage",
"requestId" : "$context.requestId",
"apiId" : "$context.apiId",
"resource_path" : "$context.resourcePath",
"resourceId" : "$context.resourceId",
"http_method" : "$context.httpMethod",
"sourceIp" : "$context.identity.sourceIp",
"userAgent" : "$context.identity.userAgent",
"caller" : "$context.identity.caller",
"user" : "$context.identity.user",
"requestTime": "$context.requestTime",
"status": "$context.status"
}`.replace(/(\r\n|\n)/gm, ""),
        executionLogging: true,
        level: "ERROR",
        fullExecutionData: false,
      },
      frameworkLambda: true,
    },
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      REGION: "${self:custom.region}",
      STAGE: "${self:custom.stage}",
      OPERATION_TABLE: "${self:custom.operationTable}",
      USER_TABLE: "${self:custom.userTable}",
      RECORD_TABLE: "${self:custom.recordTable}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
              "dynamodb:BatchGetItem",
              "dynamodb:BatchWriteItem",
            ],
            Resource: [
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.operationTable}",
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.userTable}",
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.userTable}/index/username_index",
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.recordTable}",
              "arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.recordTable}/index/user_id_date_index",
            ],
          },
        ]
      }
    },
  },
  custom: {
    region: "${opt:region, self:provider.region}",
    stage: "${opt:stage, self:provider.stage}",
    notificationMailAddress: "${opt:mail, 'true@north.com'}",
    operationTable: "${self:service}-operation-table-${opt:stage, self:provider.stage}",
    userTable: "${self:service}-user-table-${opt:stage, self:provider.stage}",
    recordTable: "${self:service}-record-table-${opt:stage, self:provider.stage}",
    tableThroughputs: {
      prod: 5,
      default: 1,
    },
    tableThroughput:
      "${self:custom.tableThroughputs.${self:custom.stage}, self:custom.tableThroughputs.default}",
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8008,
        heapInitial: "200m",
        heapMax: "1g",
        migrate: true,
        seed: true,
        convertEmptyValues: true,
      },
      seed: {
        domain: {
          sources: [
            {
              table: "${self:custom.operationTable}",
              sources: ["/src/seeds/operation-seed.json"]
            },
            {
              table: "${self:custom.userTable}",
              sources: ["/src/seeds/user-seed.json"]
            },
          ]
        }
      },
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    "serverless-offline": {
      httpPort: 3001,
      babelOptions: {
        presets: ["env"],
      },
    },
    apiGatewayThrottling: {
      maxRequestsPerSecond: 10,
      maxConcurrentRequests: 5,
    },
    alerts: {
      stages: ["prod"],
      topics: {
        alarm: {
          topic: "${self:service}-${self:custom.stage}-alerts-alarm",
          notifications: [
            {
              protocol: "email",
              endpoint: "${self:custom.notificationMailAddress}",
            },
          ],
        },
      },
      alarms: ["functionErrors", "functionThrottles"],
    },
  },
  functions,
  resources: {
    Resources: {
      ...dynamoDbTables,
    },
  },
};

module.exports = serverlessConfiguration;