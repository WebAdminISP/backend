import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from '../modules/provincias/entities/provincia.entity';
import { ProvinciasSeed } from './provincias/provincias.seed';
import { Localidad } from 'src/modules/localidades/entities/localidades.entity';
import { LocalidadesSeed } from './localidades/localidades.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia, Localidad])],
  providers: [ProvinciasSeed, LocalidadesSeed],
  exports: [ProvinciasSeed, LocalidadesSeed],
})
export class SeedsModule {}
