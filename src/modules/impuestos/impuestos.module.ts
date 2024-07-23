import { Module } from '@nestjs/common';
import { ImpuestosService } from './impuestos.service';
import { ImpuestosController } from './impuestos.controller';

@Module({
  controllers: [ImpuestosController],
  providers: [ImpuestosService],
})
export class ImpuestosModule {}
