import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  Account,
  Role,
} from '../models';
import {RoleRepository} from '../repositories';

export class RoleAccountController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) { }

  @get('/roles/{id}/account', {
    responses: {
      '200': {
        description: 'Account belonging to Role',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account),
          },
        },
      },
    },
  })
  async getAccount(
    @param.path.number('id') id: typeof Role.prototype.roleid,
  ): Promise<Account> {
    return this.roleRepository.account(id);
  }
}
