import {Entity, model, property} from '@loopback/repository';

@model()
export class Orderdetail extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
  })
  price: number;

  @property({
    type: 'number',
  })
  cost?: number;


  @property({
    type: 'number',
    required: true,
  })
  orderid: number;

  @property({
    type: 'number',
    required: true,
  })
  productid: number;

  constructor(data?: Partial<Orderdetail>) {
    super(data);
  }
}

export interface OrderdetailRelations { }

export type OrderdetailWithRelations = Orderdetail & OrderdetailRelations;
