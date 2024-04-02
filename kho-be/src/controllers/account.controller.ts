import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
import {hash} from 'bcryptjs';
import nodemailer, {SendMailOptions} from 'nodemailer';
import {Account} from '../models';
import {AccountRepository} from '../repositories';

export class AccountController {
  private transporter: nodemailer.Transporter;

  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ryannguyen2241@gmail.com',
        pass: 'xwnp lncf incz ycpn'
      }
    });
  }

  @post('/accounts')
  @response(200, {
    description: 'Account model instance',
    content: {'application/json': {schema: getModelSchemaRef(Account)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccount',
            exclude: ['accountid'],
          }),
        },
      },
    })
    account: Omit<Account, 'accountid'>,
  ): Promise<Account> {
    return this.accountRepository.create(account);
  }

  @get('/accounts/{id}')
  @response(200, {
    description: 'Account model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Account, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<Account> {
    return this.accountRepository.findById(id);
  }

  @post('/accounts/reset-password')
  async forgotPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
            },
          },
        },
      },
    })
    body: {email: string},
  ): Promise<{message: string}> {
    const {email} = body;

    const account = await this.accountRepository.findOne({where: {email}});
    if (!account) {
      throw new Error('Email not found');
    }

    const newPassword = this.generateRandomPassword();
    account.password = await hash(newPassword, 10);
    await this.accountRepository.update(account);

    const mailOptions: SendMailOptions = {
      from: 'your_email@example.com',
      to: email,
      subject: 'Your new password',
      text: `Your new password is: ${newPassword}`
    };

    await this.transporter.sendMail(mailOptions);
    return {message: 'Password reset email sent successfully'};
  }

  private generateRandomPassword(length: number = 8): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
}
