import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, repository} from '@loopback/repository';
import {HttpErrors, get, param, post, requestBody} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Orderdetail, Orders} from '../models';
import {AccountRepository, OrderdetailRepository, OrdersRepository, ProductsRepository} from '../repositories';

type OrdersWithDetails = {
  order: Orders;
  orderDetails: Orderdetail[];
};

export class OrderController {
  constructor(
    @repository(OrdersRepository)
    public ordersRepository: OrdersRepository,
    @repository(OrderdetailRepository)
    public orderdetailRepository: OrderdetailRepository,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository
  ) { }

  @post('/orders')
  @authenticate('jwt')
  async createOrder(
    @requestBody() orderData: OrdersWithDetails,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Orders> {
    const accountId = Number(currentUserProfile[securityId]);
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new HttpErrors.Unauthorized('User account not found');
    }

    let totalCost = 0;

    const newOrder = await this.ordersRepository.create({
      ...orderData.order,
      accountId: accountId,
    });

    for (const orderDetail of orderData.orderDetails) {
      if (orderData.order.type === 'xuất') {
        const product = await this.productsRepository.findById(orderDetail.productid);
        if (!product) {
          throw new HttpErrors.NotFound('Product not found');
        }
        orderDetail.price = product.price;

        const cost = orderDetail.quantity * orderDetail.price;
        orderDetail.cost = cost;

        totalCost += cost;

        await this.orderdetailRepository.create({
          ...orderDetail,
          orderid: newOrder.orderid,
        });

        product.quantity -= orderDetail.quantity;
        await this.productsRepository.update(product);
      } else if (orderData.order.type === 'nhập') {
        const cost = orderDetail.quantity * orderDetail.price;
        orderDetail.cost = cost;

        totalCost += cost;

        await this.orderdetailRepository.create({
          ...orderDetail,
          orderid: newOrder.orderid,
        });

        const product = await this.productsRepository.findById(orderDetail.productid);
        if (!product) {
          throw new HttpErrors.NotFound('Product not found');
        }
        product.quantity += orderDetail.quantity;
        await this.productsRepository.update(product);
      }
    }

    newOrder.totalcost = totalCost;
    await this.ordersRepository.update(newOrder);

    return newOrder;
  }


  @get('/orders')
  async getAllOrders(): Promise<Orders[]> {
    return this.ordersRepository.find();
  }

  @get('/orders/count-by-date')
  async countOrdersByDate(
    @param.query.string('date') date: string,
    @param.query.string('type') type: string,
  ): Promise<number> {
    const countResult: Count = await this.ordersRepository.count({
      type: type,
      createdate: date,
    });

    return countResult.count;
  }
}
