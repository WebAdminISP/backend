// Pourpose: Este es el módulo para el manejo de usuarios
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PasswordInterceptor } from '../../interceptors/password.interceptor';
import { RoleInterceptor } from '../../interceptors/role.interceptor';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auths/auth.guards';
import { Auth0Guard } from '../auths/auth0.guards';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { requiresAuth } from 'express-openid-connect';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RoleInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PasswordInterceptor,
    },
    UsersService,
    AuthGuard,
    Auth0Guard,
    CompositeAuthGuard,
    Logger,
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule implements NestModule {
  //* aqui llamo al consumer para aplicar el requireAuth() pero no hay que pasarle endpoints porque conflictua con el CompositeAuthGuard
  //* este middleware permite acceder al objecto oicd con la info de auth0
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
