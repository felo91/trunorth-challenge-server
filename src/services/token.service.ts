import jwt from 'jsonwebtoken';
import { ResponseMessage } from '../enums/response-message.enum';
import { StatusCode } from '../enums/status-code.enum';
import ResponseModel from '../models/response.model';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export const verifyToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; };
    return decoded.id;
  } catch (error) {
    throw new ResponseModel({}, StatusCode.UNAUTHORIZED, ResponseMessage.INVALID_TOKEN);
  }
};
