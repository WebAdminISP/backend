import { Module } from '@nestjs/common';
import { RelevamientosService } from './relevamientos.service';
import { RelevamientosController } from './relevamientos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relevamiento } from './entities/relevamiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Relevamiento])],
  controllers: [RelevamientosController],
  providers: [RelevamientosService],
})
export class RelevamientosModule {}
