import { v4 as UUID } from 'uuid';

export interface IOperationInterface {
  id?: string;
  type: OperationType;
  cost: number;
  inputsNeeded: number;
}

export type OperationType = 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION' | 'SQUARE_ROOT' | 'RANDOM_STRING';

export default class OperationModel {
  private _id: string;
  private _type: OperationType;
  private _cost: number;
  private _inputsNeeded: number;

  constructor({ id = UUID(), type, cost, inputsNeeded }: IOperationInterface) {
    this._id = id;
    this._type = type;
    this._cost = cost;
    this._inputsNeeded = inputsNeeded;
  }

  set id(value: string) {
    this._id = value;
  }
  get id(): string {
    return this._id;
  }

  set type(value: OperationType) {
    this._type = value;
  }
  get type(): OperationType {
    return this._type;
  }

  set cost(value: number) {
    this._cost = value;
  }
  get cost(): number {
    return this._cost;
  }

  set inputsNeeded(value: number) {
    this._inputsNeeded = value;
  }
  get inputsNeeded(): number {
    return this._inputsNeeded;
  }

  toEntityMappings(): IOperationInterface {
    return {
      id: this.id,
      type: this._type,
      cost: this._cost,
      inputsNeeded: this._inputsNeeded,
    };
  }
}
