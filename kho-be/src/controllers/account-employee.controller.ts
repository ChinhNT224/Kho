import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {AccountRepository, EmployeeRepository} from '../repositories';

export class AccountEmployeeController {
  constructor(
    @repository(AccountRepository) private accountRepository: AccountRepository,
    @repository(EmployeeRepository) private employeeRepository: EmployeeRepository,
  ) { }

  @get('/account/{accountid}/employee', {
    responses: {
      '200': {
        description: 'Get employee information associated with the account',
      },
    },
  })
  async getEmployeeInfo(
    @param.path.number('accountid') accountid: number,
  ): Promise<any> {
    const account = await this.accountRepository.findById(accountid);

    if (!account) {
      throw new Error('Account not found');
    }

    const employeeId = account.employeeid;

    if (!employeeId) {
      throw new Error('Employee ID not found in the account');
    }

    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }

  @get('/accounts-with-employees', {
    responses: {
      '200': {
        description: 'Get all accounts with associated employees',
      },
    },
  })
  async getAllAccountsWithEmployees(): Promise<any> {
    try {
      const accounts = await this.accountRepository.find();

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const accountsWithEmployees = [];

      for (const account of accounts) {
        const employeeId = account.employeeid;
        const employee = await this.employeeRepository.findById(employeeId);

        if (!employee) {
          throw new Error('Employee not found');
        }

        accountsWithEmployees.push({account, employee});
      }

      return accountsWithEmployees;
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
