import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ResponseModel from '../models/response.model';
import 'source-map-support/register';
import { StatusCode } from '../enums/status-code.enum';
import { ResponseMessage } from '../enums/response-message.enum';
import { verifyToken } from '../services/token.service';

export type LambdaHandler = (event: APIGatewayEvent, context: Context) => Promise<APIGatewayProxyResult>;

export type RequestHandler<REQ> = (body: REQ, context: Context, headers: Record<string, string | undefined>, params: QueryParams) => Promise<ResponseModel>;

export type QueryParams = Record<string, string | undefined>;

export const wrapAsRequest = <REQ = unknown>(handler: RequestHandler<REQ>): LambdaHandler => {
  return async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const requestData: REQ = event.body ? JSON.parse(event.body) : undefined;
    const headers = Object.keys(event.headers || {}).reduce((acc, cur) => {
      acc[cur] = event.headers?.[cur];
      return acc;
    }, {});
    const params = Object.keys(event.queryStringParameters || {}).reduce((acc, cur) => {
      acc[cur] = event.queryStringParameters?.[cur];
      return acc;
    }, {});
    const response = await handler(requestData, context, headers, params);
    return response.generate();
  };
};

export const wrapAsRequestWithAuth = <REQ = unknown>(handler: RequestHandler<REQ>): LambdaHandler => {
  const wrappedHandler: RequestHandler<REQ> = async (body, context, headers, params) => {
    try {
      const token = headers.Authorization || headers.authorization;
      if (!token) {
        throw new ResponseModel({}, StatusCode.UNAUTHORIZED, ResponseMessage.AUTH_MISSING);
      }
      const user = verifyToken(token);
      context['user'] = user;
    } catch (error) {
      return error instanceof ResponseModel ? error : new ResponseModel({}, StatusCode.UNAUTHORIZED, ResponseMessage.INVALID_TOKEN);
    }

    return handler(body, context, headers, params);
  };

  return wrapAsRequest(wrappedHandler);
};
