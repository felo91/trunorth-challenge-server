import fetch from 'node-fetch';
import { ResponseMessage } from 'src/enums/response-message.enum';
import { StatusCode } from 'src/enums/status-code.enum';
import ResponseModel from 'src/models/response.model';

export const makeOperation = async ({ type, amounts }): Promise<number | ResponseModel> => {
  try {
    switch (type) {
      case 'ADDITION':
        return amounts.reduce((total, amount) => total + amount, 0);
      case 'SUBTRACTION':
        return amounts.reduce((total, amount) => total - amount);
      case 'MULTIPLICATION':
        return amounts.reduce((total, amount) => total * amount, 1);
      case 'DIVISION':
        if (amounts.slice(1).includes(0)) throw ResponseMessage.DIVIDE_ZERO;
        return amounts.reduce((total, amount) => total / amount);
      case 'SQUARE_ROOT':
        if (amounts[0] < 0) throw ResponseMessage.NEGATIVE_ROOT;
        return Math.sqrt(amounts[0]);
      case 'RANDOM_STRING':
        return await getRandomNumber();
      default:
        throw ResponseMessage.INVALID_OPERATION;
    }
  } catch (error) {
    throw new ResponseModel({}, StatusCode.BAD_REQUEST, error);
  }
};

const getRandomNumber = async (): Promise<number> => {
  const body = {
    jsonrpc: '2.0',
    method: 'generateIntegers',
    params: {
      apiKey: process.env.RANDOM_ORG_API_KEY,
      n: 1,
      min: 0,
      max: 99999999,
      replacement: true,
    },
    id: 1,
  };


  const response = await fetch('https://api.random.org/json-rpc/4/invoke', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data.result.random.data[0];
};
