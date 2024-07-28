import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localidad } from '../localidades/entities/localidades.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { AuthGuard } from './auth.guards';
import { Auth0Guard } from './auth0.guards';
import { CompositeAuthGuard } from './compositeAuthGuard';
import { requiresAuth } from 'express-openid-connect';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Provincia, Localidad, Equipo, Servicio])],
  controllers: [AuthsController],
  providers: [
    AuthsService, 
    UsersService,
    AuthGuard,
    Auth0Guard,
    CompositeAuthGuard,
    Logger,]
})
export class AuthsModule implements NestModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(requiresAuth()).forRoutes();
  }
}
