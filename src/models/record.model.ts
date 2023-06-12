import { v4 as UUID } from 'uuid';

export interface IRecordProps {
  id?: string;
  operation_id: string;
  user_id: string;
  amount: [number, number];
  user_balance: number;
  operation_response: string;
  deleted?: boolean;
}

export interface IRecordDTO {
  id?: string;
  operation_id: string;
  amount: [number, number];
  user_balance?: number;
  user_id?: string;
  operation_response?: string;
  deleted?: boolean;
}

export interface IRecordInterface extends IRecordProps {
  date: number;
}

export default class RecordModel {
  private _id: string;
  private _operation_id: string;
  private _user_id: string;
  private _amount: [number, number];
  private _user_balance: number;
  private _operation_response: string;
  private _deleted: boolean;

  constructor({ id = UUID(), operation_id, user_id, amount, user_balance, operation_response, deleted = false }: IRecordDTO) {
    if (user_id == null) throw 'Its not possible to create a record without and user';
    this._id = id;
    this._operation_id = operation_id;
    this._user_id = user_id;
    this._amount = amount;
    this._user_balance = user_balance!;
    this._operation_response = operation_response!;
    this._deleted = deleted;
  }

  toEntityMappings(): IRecordInterface {
    return {
      id: this.id,
      operation_id: this.operation_id,
      user_id: this.user_id,
      amount: this.amount,
      user_balance: this.user_balance,
      operation_response: this.operation_response,
      deleted: this.deleted,
      date: new Date().getTime(),
    };
  }

  set id(value: string) {
    this._id = value;
  }
  get id(): string {
    return this._id;
  }

  set operation_id(value: string) {
    this._operation_id = value;
  }
  get operation_id(): string {
    return this._operation_id;
  }

  set user_id(value: string) {
    this._user_id = value;
  }
  get user_id(): string {
    return this._user_id;
  }

  set amount(value: [number, number]) {
    this._amount = value;
  }
  get amount(): [number, number] {
    return this._amount;
  }

  set user_balance(value: number) {
    this._user_balance = value;
  }
  get user_balance(): number {
    return this._user_balance;
  }

  set operation_response(value: string) {
    this._operation_response = value;
  }
  get operation_response(): string {
    return this._operation_response;
  }

  set deleted(value: boolean) {
    this._deleted = value;
  }
  get deleted(): boolean {
    return this._deleted;
  }
}
