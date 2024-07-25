import { Injectable } from '@nestjs/common';
import { CreateRelevamientoDto } from './dto/create-relevamiento.dto';
import { UpdateRelevamientoDto } from './dto/update-relevamiento.dto';

@Injectable()
export class RelevamientosService {
  create(createRelevamientoDto: CreateRelevamientoDto) {
    return 'This action adds a new relevamiento';
  }

  findAll() {
    return `This action returns all relevamientos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relevamiento`;
  }

  update(id: number, updateRelevamientoDto: UpdateRelevamientoDto) {
    return `This action updates a #${id} relevamiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} relevamiento`;
  }
}
