import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RelevamientosService } from './relevamientos.service';
import { RelevamientosController } from './relevamientos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relevamiento } from './entities/relevamiento.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Localidad } from '../localidades/entities/localidades.entity';
import { AuthGuard } from '../auths/auth.guards';
import { Auth0Guard } from '../auths/auth0.guards';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { requiresAuth } from 'express-openid-connect';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule,TypeOrmModule.forFeature([Relevamiento, Provincia, Localidad])],
  controllers: [RelevamientosController],
  providers: [
    RelevamientosService,
    UsersService,
    AuthGuard,
    Auth0Guard,
    CompositeAuthGuard,
    Logger,
  ],
})
export class RelevamientosModule implements NestModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(requiresAuth()).forRoutes()
  }
}
