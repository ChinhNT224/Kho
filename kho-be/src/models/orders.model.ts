import {Entity, hasMany, model, property} from '@loopback/repository';
import {Orderdetail} from './orderdetail.model';
import {Products} from './products.model';

@model()
export class Orders extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  orderid?: number;

  @property({
    type: 'date',
  })
  createdate?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'number',
  })
  totalcost: number;

  @property({
    type: 'number',
  })
  accountId?: number;

  @hasMany(() => Products, {
    through: {
      model: () => Orderdetail,
      keyFrom: 'orderid',
      keyTo: 'orderid',
    },
    keyTo: 'productid'
  })
  products: Products[];


  constructor(data?: Partial<Orders>) {
    super(data);
  }
}

export interface OrdersRelations {

}

export type OrdersWithRelations = Orders & OrdersRelations;
