import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localidad } from '../localidades/entities/localidades.entity';
import { Provincia } from '../provincias/entities/provincia.entity';
import { Equipo } from '../equipos/entities/equipo.entity';
import { Servicio } from '../servicios/entities/servicio.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Provincia, Localidad, Equipo, Servicio])],
  controllers: [AuthsController],
  providers: [AuthsService, UsersService],
})
export class AuthsModule {}
