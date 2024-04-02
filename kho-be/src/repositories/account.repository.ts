import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Account, AccountRelations, Employee, Orders} from '../models';
import {EmployeeRepository} from './employee.repository';
import {OrdersRepository} from './orders.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.accountid,
  AccountRelations
> {

  public readonly employee: HasOneRepositoryFactory<Employee, typeof Account.prototype.accountid>;

  public readonly orders: HasManyRepositoryFactory<Orders, typeof Account.prototype.accountid>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('EmployeeRepository') protected employeeRepositoryGetter: Getter<EmployeeRepository>, @repository.getter('OrdersRepository') protected ordersRepositoryGetter: Getter<OrdersRepository>,
  ) {
    super(Account, dataSource);
    this.orders = this.createHasManyRepositoryFactoryFor('orders', ordersRepositoryGetter,);
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
    this.employee = this.createHasOneRepositoryFactoryFor('employee', employeeRepositoryGetter);
    this.registerInclusionResolver('employee', this.employee.inclusionResolver);
  }
}
