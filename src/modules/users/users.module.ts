// Pourpose: Este es el módulo para el manejo de usuarios
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PasswordInterceptor } from '../../interceptors/password.interceptor';
import { RoleInterceptor } from '../../interceptors/role.interceptor';
import { User } from './entities/user.entity';

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
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
