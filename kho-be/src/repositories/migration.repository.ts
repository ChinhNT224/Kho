import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Migration} from '../models';

export class MigrationRepository extends DefaultCrudRepository<
  Migration,
  typeof Migration.prototype.id
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Migration, dataSource);
  }
}
