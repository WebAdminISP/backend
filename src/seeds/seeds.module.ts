import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from '../modules/provincias/entities/provincia.entity';
import { ProvinciasSeed } from './provincias/provincias.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia])],
  providers: [ProvinciasSeed],
  exports: [ProvinciasSeed],
})
export class SeedsModule {}
