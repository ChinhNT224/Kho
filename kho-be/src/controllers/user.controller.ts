import {authenticate, TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, patch, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {compare, hash} from 'bcryptjs';
import {Account} from '../models';

function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

import {AccountRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) { }

  @post('/users/login')
  async login(
    @requestBody() credentials: {loginname: string; password: string},
  ): Promise<{token: string; roleid: number | undefined}> {
    const account = await this.accountRepository.findOne({
      where: {loginname: credentials.loginname},
    });

    if (!account) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const validPassword = await compare(credentials.password, account.password);

    if (!validPassword) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const userProfile: UserProfile = {
      [securityId]: account.accountid?.toString() ?? '',
      name: account.loginname,
    };

    const token = await this.jwtService.generateToken(userProfile);

    return {token, roleid: account.roleid};
  }

  @patch('/users/update-profile')
  @authenticate('jwt')
  async updateProfile(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody()
    profileData: Partial<Account>,
  ): Promise<{message: string}> {
    const accountId = parseInt(currentUserProfile[securityId]);

    const existingAccount = await this.accountRepository.findById(accountId);
    if (!existingAccount) {
      throw new HttpErrors.Unauthorized('User not found');
    }

    if (existingAccount.accountid !== accountId) {
      throw new HttpErrors.Forbidden('You are not authorized to update this profile');
    }

    await this.accountRepository.updateById(accountId, profileData);

    return {message: 'Profile updated successfully'};
  }

  @post('/users/signup')
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              loginname: {type: 'string'},
              password: {type: 'string'},
              email: {type: 'string'},
              employeeid: {type: 'number'},
              roleid: {type: 'number'},
            },
            required: ['loginname', 'password', 'email', 'employeeid', 'roleid'],
          },
        },
      },
    })
    newUser: {loginname: string; password: string; email: string; employeeid: number; roleid: number},
  ): Promise<{message: string}> {

    const existingAccount = await this.accountRepository.findOne({where: {loginname: newUser.loginname}});
    if (existingAccount) {
      throw new HttpErrors.BadRequest('Login name already exists');
    }

    const hashedPassword = await hash(newUser.password, 10);

    await this.accountRepository.create({
      loginname: newUser.loginname,
      password: hashedPassword,
      email: newUser.email,
      employeeid: newUser.employeeid,
      roleid: newUser.roleid,
    });

    return {message: 'Account created successfully'};
  }

  @patch('/users/change-password')
  @authenticate('jwt')
  async changePassword(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody()
    passwords: {oldPassword: string, newPassword: string},
  ): Promise<{message: string}> {

    const userId = parseInt(currentUserProfile[securityId]);

    const existingAccount = await this.accountRepository.findById(userId);
    if (!existingAccount) {
      throw new HttpErrors.Unauthorized('User not found');
    }

    const validPassword = await compare(passwords.oldPassword, existingAccount.password);
    if (!validPassword) {
      throw new HttpErrors.Unauthorized('Invalid old password');
    }

    if (!isValidPassword(passwords.newPassword)) {
      throw new HttpErrors.BadRequest('Invalid new password format');
    }

    const hashedNewPassword = await hash(passwords.newPassword, 10);

    await this.accountRepository.updateById(userId, {password: hashedNewPassword});

    return {message: 'Password changed successfully'};
  }

  @get('/user')
  @authenticate('jwt')
  @response(200, {
    description: 'User profile information',
    content: {'application/json': {schema: getModelSchemaRef(Account)}},
  })
  async getUserProfile(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Account> {
    if (!currentUserProfile) {
      throw new HttpErrors.Unauthorized('User not authenticated');
    }

    const accountId = parseInt(currentUserProfile[securityId]);

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new HttpErrors.NotFound('Account not found');
    }

    return account;
  }
}
