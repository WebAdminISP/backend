import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo) private equiposRepository: Repository<Equipo>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createEquipoDto: CreateEquipoDto) {
    const existingEquipo = await this.equiposRepository.findOne({
      where: { macEquipo: createEquipoDto.macEquipo },
    });
    if (existingEquipo) {
      throw new BadRequestException('El equipo ya existe');
    }

    // const user = await this.usersRepository.findOne({
    //   where: { id: createEquipoDto.userId },
    // });

    // if (!user) {
    //   throw new NotFoundException(
    //     `User con ID ${createEquipoDto.userId} no existe`,
    //   );
    // }

    const equipo = this.equiposRepository.create({
      ...createEquipoDto,
    });
    return await this.equiposRepository.save(equipo);
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.equiposRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} equipo`;
  }

  update(id: number, updateEquipoDto: UpdateEquipoDto) {
    return `This action updates a #${id} equipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipo`;
  }
}
