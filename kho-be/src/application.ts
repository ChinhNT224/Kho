import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, MyUserService, UserServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import nodemailer from 'nodemailer';
import path from 'path';
import {PostgresDataSource} from './datasources';
import {MigrationRepository, ProductsRepository} from './repositories';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class KhoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.static('/', path.join(__dirname, '../public'));

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {

        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.component(AuthenticationComponent);

    this.component(JWTAuthenticationComponent);

    this.dataSource(PostgresDataSource, UserServiceBindings.DATASOURCE_NAME);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);


    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ryannguyen2241@gmail.com',
        pass: 'xwnp lncf incz ycpn'
      }
    });

    this.bind('emailTransporter').to(transporter);
    this.bind('repositories.MigrationRepository').toClass(MigrationRepository);
    this.bind('datasources.postgres').toClass(PostgresDataSource);
    this.bind('repositories.ProductsRepository').toClass(ProductsRepository);
  }
}
