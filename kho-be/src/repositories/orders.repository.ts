import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Orders, OrdersRelations, Products, Orderdetail} from '../models';
import {OrderdetailRepository} from './orderdetail.repository';
import {ProductsRepository} from './products.repository';

export class OrdersRepository extends DefaultCrudRepository<
  Orders,
  typeof Orders.prototype.orderid,
  OrdersRelations
> {

  public readonly products: HasManyThroughRepositoryFactory<Products, typeof Products.prototype.productid,
          Orderdetail,
          typeof Orders.prototype.orderid
        >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('OrderdetailRepository') protected orderdetailRepositoryGetter: Getter<OrderdetailRepository>, @repository.getter('ProductsRepository') protected productsRepositoryGetter: Getter<ProductsRepository>,
  ) {
    super(Orders, dataSource);
    this.products = this.createHasManyThroughRepositoryFactoryFor('products', productsRepositoryGetter, orderdetailRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
