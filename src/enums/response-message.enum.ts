export enum ResponseMessage {
  ERROR = 'Unknown error.',
  INVALID_REQUEST = 'Invalid Request!',
  GET_ITEM_ERROR = 'Item does not exist',
  CREATE_OPERATION_SUCCESS = 'Operation successfully created',
  CREATE_OPERATION_FAIL = 'Operation could not be created',
  GET_OPERATION_SUCCESS = 'Operation successfully retrieved',
  GET_OPERATION_FAIL = 'Operation not found',
  UPDATE_OPERATION_SUCCESS = 'Operation successfully updated',
  UPDATE_OPERATION_FAIL = 'Operation could not be updated',
  DELETE_OPERATION_SUCCESS = 'Operation successfully deleted',
  DELETE_OPERATION_NOTFOUND = 'Operation has already been deleted',
  DELETE_OPERATION_FAIL = 'Operation could not be deleted',
  CREATE_USER_SUCCESS = 'User successfully created',
  CREATE_USER_FAIL = 'User could not be created',
  GET_USER_SUCCESS = 'User successfully retrieved',
  GET_USER_FAIL = 'User not found',
  UPDATE_USER_SUCCESS = 'User successfully updated',
  UPDATE_USER_FAIL = 'User could not be updated',
  DELETE_USER_SUCCESS = 'User successfully deleted',
  DELETE_USER_NOTFOUND = 'User has already been deleted',
  DELETE_USER_FAIL = 'User could not be deleted',
  RECORD_NOT_FOUND = 'Record not found',
  CREATE_RECORD_SUCCESS = 'Record successfully created',
  CREATE_RECORD_FAIL = 'Record could not be created',
  GET_RECORD_SUCCESS = 'Record successfully retrieved',
  GET_RECORD_FAIL = 'Record not found',
  UPDATE_RECORD_SUCCESS = 'Record successfully updated',
  UPDATE_RECORD_FAIL = 'Record could not be updated',
  DELETE_RECORD_SUCCESS = 'Record successfully deleted',
  DELETE_RECORD_NOTFOUND = 'Record has already been deleted',
  DELETE_RECORD_FAIL = 'Record could not be deleted',
  USER_NOT_FOUND = 'User not found',
  INVALID_PASSWORD = 'Invalid password',
  LOGIN_SUCCESS = 'Login successful',
  LOGIN_FAIL = 'Login failed',
  NO_TOKEN = 'No token provided',
  INVALID_TOKEN = 'Invalid token',
  AUTH_MISSING = 'Authorization header missing',
  DIVIDE_ZERO = 'Cannot divide by zero',
  NEGATIVE_ROOT = 'Cannot take the square root of a negative number',
  INVALID_OPERATION = 'Invalid operation',
  ALREADY_SEED = 'Database has already been seeded',
  SEED_SUCCESS = 'Database successfully seeded',
  SEED_FAIL = 'Database could not be seeded',
  USER_CREDIT_NOT_ENOUGH = "User's credit is not enough",
}
