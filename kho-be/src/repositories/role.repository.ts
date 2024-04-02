import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Role, RoleRelations, Account} from '../models';
import {AccountRepository} from './account.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.roleid,
  RoleRelations
> {

  public readonly account: BelongsToAccessor<Account, typeof Role.prototype.roleid>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(Role, dataSource);
    this.account = this.createBelongsToAccessorFor('account', accountRepositoryGetter,);
    this.registerInclusionResolver('account', this.account.inclusionResolver);
  }
}
