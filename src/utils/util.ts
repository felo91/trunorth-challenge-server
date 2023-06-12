export type DatabaseProp = {
  operationTable: string;
  recordTable: string;
  userTable: string;
};

export const databaseTables = (): DatabaseProp => {
  const { OPERATION_TABLE, RECORD_TABLE, USER_TABLE } = process.env;
  return {
    operationTable: OPERATION_TABLE ?? 'unknown-operation-table',
    recordTable: RECORD_TABLE ?? 'unknown-record-table',
    userTable: USER_TABLE ?? 'unknown-user-table',
  };
};
