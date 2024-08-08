import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createAsistenciaDto: CreateAsistenciaDto, user: any) {
    let foundUser = null;
    if (createAsistenciaDto.userId) {
      foundUser = await this.usersRepository.findOne({
        where: { id: createAsistenciaDto.userId },
      });
      if (!foundUser) {
        throw new BadRequestException(
          `Usuario con id ${createAsistenciaDto.userId} no encontrado.`,
        );
      }
    }

    // Verificar que el user.nombre existe y no es nulo
    if (!user || !user.nombre) {
      throw new BadRequestException('Usuario autenticado no tiene nombre.');
    }

    const asistencia = this.asistenciaRepository.create({
      ...createAsistenciaDto,
      agente: user.nombre,
      user: foundUser,
      userId: createAsistenciaDto.userId,
    });

    console.log('Creating Asistencia:', asistencia);

    return await this.asistenciaRepository.save(asistencia);
  }

  findAll() {
    return `This action returns all asistencias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asistencia`;
  }

  update(id: number, updateAsistenciaDto: UpdateAsistenciaDto) {
    return `This action updates a #${id} asistencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} asistencia`;
  }
}
