import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Orderdetail, OrderdetailRelations} from '../models';

export class OrderdetailRepository extends DefaultCrudRepository<
  Orderdetail,
  typeof Orderdetail.prototype.orderid,
  OrderdetailRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Orderdetail, dataSource);
  }
}
