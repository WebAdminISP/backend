import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacturacionDto } from './dto/create-facturacion.dto';
import { UpdateFacturacionDto } from './dto/update-facturacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/facturacion.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FacturacionService {
  constructor(
    @InjectRepository(Factura) private facturasRepository: Repository<Factura>,
    private dataSource: DataSource,
  ) {}

  create(createFacturacionDto: CreateFacturacionDto) {
    return 'This action adds a new facturacion';
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.facturasRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  async findOne(id: string) {
    const factura = await this.facturasRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (factura) {
      return {
        ...factura,
      };
    } else {
      return null;
    }
  }

  async update(id: string, updatedFacturacionData: Partial<Factura>) {
    const oldFactura = await this.facturasRepository.findOneBy({ id: id });

    if (!oldFactura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    // Merge de datos: copiar las propiedades actualizadas
    Object.assign(oldFactura, updatedFacturacionData);

    const updatedFactura = await this.facturasRepository.save(oldFactura);
    return updatedFactura;
  }
}
