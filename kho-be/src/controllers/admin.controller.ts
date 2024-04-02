import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, del, get, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {hash} from 'bcryptjs';
import {Account, Employee, Products} from '../models';
import {AccountRepository, EmployeeRepository, ProductsRepository} from '../repositories';

export class AdminController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository,
  ) { }

  @post('/admin/employees')
  @authenticate('jwt')
  @response(200, {
    description: 'Employee model instance',
    content: {'application/json': {schema: getModelSchemaRef(Employee)}},
  })
  async createEmployee(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, {
            title: 'NewEmployee',
            exclude: ['employeeid'],
          }),
        },
      },
    })
    employee: Omit<Employee, 'employeeid'>,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Employee> {
    await this.verifyAdminRole(currentUserProfile);
    try {
      console.log('Creating new employee:', employee);
      await this.verifyAdminRole(currentUserProfile);
      const createdEmployee = await this.employeeRepository.create(employee);
      console.log('New employee created:', createdEmployee);
      return createdEmployee;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  @patch('/admin/employees/{id}')
  @authenticate('jwt')
  async updateEmployeeById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, {partial: true}),
        },
      },
    })
    employee: Employee,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    await this.verifyAdminRole(currentUserProfile);
    await this.employeeRepository.updateById(id, employee);
  }

  @del('/admin/employees/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Employee DELETE success',
  })
  async deleteEmployee(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<void> {
    console.log('Current user profile:', currentUserProfile);
    await this.verifyAdminRole(currentUserProfile);
    try {
      console.log('Deleting employee with ID:', id);
      await this.verifyAdminRole(currentUserProfile);
      await this.employeeRepository.deleteById(id);
      console.log('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  @get('/admin/employees')
  @authenticate('jwt')
  @response(200, {
    description: 'Array of Employee model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Employee, {includeRelations: true}),
        },
      },
    },
  })
  async findEmployees(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Employee[]> {
    await this.verifyAdminRole(currentUserProfile);
    return this.employeeRepository.find();
  }


  async verifyAdminRole(userProfile: UserProfile): Promise<void> {
    if (!userProfile) {
      console.error('User not authenticated');
      throw new HttpErrors.Unauthorized('User not authenticated');
    }

    const accountId = Number(userProfile[securityId]);

    console.log('User profile:', userProfile);

    const account = await this.accountRepository.findById(accountId);
    if (!account || account.roleid !== 1) {
      console.error('Insufficient permissions');
      throw new HttpErrors.Forbidden('Insufficient permissions');
    }
  }

  @post('/admin/products')
  @authenticate('jwt')
  @response(200, {
    description: 'Products model instance',
    content: {'application/json': {schema: getModelSchemaRef(Products)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {
            title: 'NewProducts',
            exclude: ['productid'],
          }),
        },
      },
    })
    products: Omit<Products, 'productid'>,
  ): Promise<Products> {
    return this.productsRepository.create(products);
  }

  @patch('/admin/products/{id}')
  @authenticate('jwt')
  @response(204, {
    description: 'Products PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    products: Products,
  ): Promise<void> {
    await this.productsRepository.updateById(id, products);
  }

  @patch('/admin/accounts/{id}')
  @authenticate('jwt')
  async updateAccountById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Partial<Account>,
  ): Promise<void> {
    if (account.password) {
      account.password = await hash(account.password, 10);
    }
    await this.accountRepository.updateById(id, account);
  }

  @del('/admin/accounts/{id}')
  @authenticate('jwt')
  async deleteAccount(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<void> {
    await this.verifyAdminRole(currentUserProfile);
    try {
      console.log('Deleting account with ID:', id);
      await this.accountRepository.deleteById(id);
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}
