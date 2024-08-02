import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacturacionMock } from './facturacion.mock';
import { Factura } from '../../modules/facturacion/entities/facturacion.entity';

@Injectable()
export class FacturacionSeed {
  constructor(
    @InjectRepository(Factura)
    private readonly facturasRepository: Repository<Factura>,
  ) {}

  async seed() {
    // Ver si hay facturas cargadas
    console.log('Seed facturación inicializado');
    // Obtener todas las facturas existentes de una vez
    const hayFacturas = (await this.facturasRepository.find()).map(
      (factura) => factura.numFactura,
    );

    for (const facturasData of FacturacionMock) {
      if (!hayFacturas.includes(facturasData.numFactura)) {
        const factura = new Factura();
        factura.agente = facturasData.agente;
        factura.fechaGen = facturasData.fechaGen;
        factura.concepto = facturasData.concepto;
        factura.observaciones = facturasData.observaciones;
        factura.numFactura = facturasData.numFactura;
        factura.tipoPago = facturasData.tipoPago;
        factura.fechaVencimiento = facturasData.fechaVencimiento;
        factura.importe = facturasData.importe;
        await this.facturasRepository.save(factura);
        console.log(`Factura ${factura.numFactura} guardado en la DB`);
      }
    }
  }
}
