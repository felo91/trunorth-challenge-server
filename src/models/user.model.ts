import { v4 as UUID } from 'uuid';
import * as bcrypt from 'bcryptjs';

export interface IUserInterface {
  id?: string;
  username: string;
  password: string;
  status?: UserStatus;
}

type UserStatus = 'ACTIVE' | 'INACTIVE';

export default class UserModel {
  private _id: string;
  private _username: string;
  private _password: string;
  private _status: UserStatus;

  constructor({ id, username, password, status = 'ACTIVE' }: IUserInterface) {
    this._password = id && password.startsWith('$2a$') ? password : bcrypt.hashSync(password, 10);
    this._id = id ? id : UUID();
    this._username = username;
    this._status = status;
  }

  set id(value: string) {
    this._id = value;
  }
  get id(): string {
    return this._id;
  }

  set username(value: string) {
    this._username = value;
  }
  get username(): string {
    return this._username;
  }

  set password(value: string) {
    this._password = bcrypt.hashSync(value, 10);
  }
  get password(): string {
    return this._password;
  }

  set status(value: UserStatus) {
    this._status = value;
  }
  get status(): UserStatus {
    return this._status;
  }

  toEntityMappings(): IUserInterface {
    return {
      id: this.id,
      username: this._username,
      password: this._password,
      status: this._status,
    };
  }
}
