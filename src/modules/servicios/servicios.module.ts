import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { Auth0Guard } from '../auths/auth0.guards';
import { AuthGuard } from '../auths/auth.guards';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { UsersService } from '../users/users.service';
import { requiresAuth } from 'express-openid-connect';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio, User])],
  controllers: [ServiciosController, UsersController],
  providers: [
    ServiciosService,
    AuthGuard,
    Auth0Guard,
    CompositeAuthGuard,
    Logger,
    UsersService,
  ],
})
export class ServiciosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //protege con autenticacion cualquier endpoint aqui listado
    consumer.apply(requiresAuth()).forRoutes();
  }
}
