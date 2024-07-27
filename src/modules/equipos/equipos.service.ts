import { User } from 'src/modules/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo) private equiposRepository: Repository<Equipo>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    const existingEquipo = await this.equiposRepository.findOne({
      where: { macEquipo: createEquipoDto.macEquipo },
    });
    if (existingEquipo) {
      throw new BadRequestException('El equipo ya existe');
    }

    let user = null;
    if (createEquipoDto.userId) {
      user = await this.usersRepository.findOne({
        where: { id: createEquipoDto.userId },
      });
      if (!user) {
        throw new BadRequestException(
          `Usuario con id ${createEquipoDto.userId} no encontrado.`,
        );
      }
    }

    const equipo = this.equiposRepository.create({
      ...createEquipoDto,
      user, // Asignamos el objeto User si existe
    });

    try {
      return await this.equiposRepository.save(equipo);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar el equipo.',
      );
    }
  }

  async findAll(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.equiposRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  async findOne(id: string) {
    const equipo = await this.equiposRepository.findOne({
      where: { id: id },
    });

    if (equipo) {
      return {
        ...equipo,
      };
    } else {
      return null;
    }
  }

  async update(id: string, updatedEquipoData: Partial<Equipo>) {
    const oldEquipo = await this.equiposRepository.findOneBy({ id: id });

    if (!oldEquipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    // Merge de datos: copiar las propiedades actualizadas
    Object.assign(oldEquipo, updatedEquipoData);

    const updatedEquipo = await this.equiposRepository.save(oldEquipo);
    return updatedEquipo;
  }

  async remove(id: string) {
    const oldEquipo = await this.equiposRepository.findOne({
      where: { id },
    });

    if (!oldEquipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    await this.equiposRepository.remove(oldEquipo);

    return { success: `Equipo con id: ${id} eliminado con éxito` };
  }
}
