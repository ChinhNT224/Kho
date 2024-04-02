import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Account} from './account.model';

@model()
export class Role extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  roleid?: number;

  @property({
    type: 'string',
    required: true,
  })
  rolename: string;

  @belongsTo(() => Account)
  accountId: number;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
