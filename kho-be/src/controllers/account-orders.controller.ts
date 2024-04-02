import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param
} from '@loopback/rest';
import {
  Orders
} from '../models';
import {AccountRepository} from '../repositories';

export class AccountOrdersController {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
  ) { }

  @get('/accounts/{id}/orders', {
    responses: {
      '200': {
        description: 'Array of Account has many Orders',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Orders)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Orders>,
  ): Promise<Orders[]> {
    return this.accountRepository.orders(id).find(filter);
  }
}
