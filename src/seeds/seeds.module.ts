import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from '../modules/provincias/entities/provincia.entity';
import { ProvinciasSeed } from './provincias/provincias.seed';
import { Localidad } from 'src/modules/localidades/entities/localidades.entity';
import { LocalidadesSeed } from './localidades/localidades.seed';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersSeed } from './users/users.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia, Localidad, User])],
  providers: [ProvinciasSeed, LocalidadesSeed, UsersSeed],
  exports: [ProvinciasSeed, LocalidadesSeed, UsersSeed],
})
export class SeedsModule {}
