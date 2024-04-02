import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Employee} from './employee.model';
import {Orders} from './orders.model';

@model()
export class Account extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  accountid?: number;

  @property({
    type: 'string',
    required: true,
  })
  loginname: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string; 

  @property({
    type: 'number',
  })
  employeeid?: number;

  @property({
    type: 'number',
  })
  roleid?: number;

  @hasOne(() => Employee, {keyTo: 'employeeid'})
  employee: Employee;

  @hasMany(() => Orders, {keyTo: 'roleid'})
  orders: Orders[];

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;
