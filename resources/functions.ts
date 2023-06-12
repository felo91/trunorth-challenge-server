export default {
  login: {
    handler: "handler.loginV1",
    events: [
      {
        http: {
          method: "POST",
          path: "v1/login",
          cors: true,
        },
      },
    ],
  },
  createRecord: {
    handler: "handler.createRecordV1",
    events: [
      {
        http: {
          method: "POST",
          path: "v1/record",
          cors: true,
        },
      },
    ],
  },
  deleteRecord: {
    handler: "handler.deleteRecordV1",
    events: [
      {
        http: {
          method: "DELETE",
          path: "v1/record",
          cors: true,
        },
      },
    ],
  },
  listRecordsByUser: {
    handler: "handler.listRecordsByUserV1",
    events: [
      {
        http: {
          method: "GET",
          path: "v1/record",
          cors: true,
        },
      },
    ],
  },
  listOperations: {
    handler: "handler.listOperationsV1",
    events: [
      {
        http: {
          method: "GET",
          path: "v1/operation",
          cors: true,
        },
      },
    ],
  },
  seedData: {
    handler: 'handler.seedData',
    events: [
      {
        http: {
          method: 'post',
          path: 'seedData',
          cors: true,
        }
      }
    ]
  },
  handleApiGatewayLog: {
    handler: "ops-handler.handleApiGatewayLog",
    events: [
      {
        subscriptionFilter: {
          logGroupName: "/aws/api-gateway/${self:service}",
          filterPattern:
            '{$.status = "429" || $.status = "502" || $.status = "504"}',
        },
      } as any,
    ],
  },
};
