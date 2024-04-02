import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Orderdetail, Orders} from '../models';
import {OrderdetailRepository, OrdersRepository, ProductsRepository} from '../repositories';

interface OrderdetailWithProductName extends Orderdetail {
  name: string;
}

export class OrdersProductsController {
  constructor(
    @repository(OrdersRepository)
    public ordersRepository: OrdersRepository,
    @repository(OrderdetailRepository)
    public orderdetailRepository: OrderdetailRepository,
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository
  ) { }

  @get('/orders/{id}/products', {
    responses: {
      '200': {
        description: 'Order and its associated products',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                order: getModelSchemaRef(Orders),
                orderDetails: {
                  type: 'array',
                  items: getModelSchemaRef(Orderdetail),
                },
              },
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
  ): Promise<{order: Orders, orderDetails: OrderdetailWithProductName[]}> {

    const order: Orders = await this.ordersRepository.findById(id, {
      fields: {createdate: true, type: true, totalcost: true},
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const orderDetails: Orderdetail[] = await this.orderdetailRepository.find({
      where: {
        orderid: id,
      },
    });

    const orderDetailsWithProductName: OrderdetailWithProductName[] = [];
    for (const detail of orderDetails) {
      const product = await this.productsRepository.findById(detail.productid);
      if (product) {
        const orderDetailWithProductName: OrderdetailWithProductName = Object.assign({}, detail, {name: product.name});
        orderDetailsWithProductName.push(orderDetailWithProductName);
      }
    }


    return {order, orderDetails: orderDetailsWithProductName};
  }
}
