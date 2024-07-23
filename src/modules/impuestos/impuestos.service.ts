import { Injectable } from '@nestjs/common';
import { CreateImpuestoDto } from './dto/create-impuesto.dto';
import { UpdateImpuestoDto } from './dto/update-impuesto.dto';

@Injectable()
export class ImpuestosService {
  create(createImpuestoDto: CreateImpuestoDto) {
    return 'This action adds a new impuesto';
  }

  findAll() {
    return `This action returns all impuestos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} impuesto`;
  }

  update(id: number, updateImpuestoDto: UpdateImpuestoDto) {
    return `This action updates a #${id} impuesto`;
  }

  remove(id: number) {
    return `This action removes a #${id} impuesto`;
  }
}
