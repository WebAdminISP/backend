import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProvinciasService } from './provincias.service';
import { ProvinciasController } from './provincias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './entities/provincia.entity';
import { requiresAuth } from 'express-openid-connect';
import { AuthGuard } from '../auths/auth.guards';
import { Auth0Guard } from '../auths/auth0.guards';
import { CompositeAuthGuard } from '../auths/compositeAuthGuard';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia]), UsersModule],
  controllers: [ProvinciasController],
  providers: [
    ProvinciasService,
    UsersService,
    AuthGuard,
    Auth0Guard,
    CompositeAuthGuard,
    Logger,
  ],
})
export class ProvinciasModule implements NestModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(requiresAuth())
  }
}
