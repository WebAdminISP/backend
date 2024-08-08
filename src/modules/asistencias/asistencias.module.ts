import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencias.controller';
import { UsersController } from '../users/users.controller';
import { Asistencia } from './entities/asistencia.entity';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CloudinaryService } from '../../common/cloudinary.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Asistencia, User])],
  controllers: [AsistenciasController, UsersController],
  providers: [AsistenciasService, UsersService, CloudinaryService],
})
export class AsistenciasModule {}
