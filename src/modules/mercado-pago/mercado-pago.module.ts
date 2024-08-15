import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { MercadoPagoController } from './mercado-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Factura } from '../facturacion/entities/facturacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Factura])],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [],
})
export class MercadoPagoModule {}
