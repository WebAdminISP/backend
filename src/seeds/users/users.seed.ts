import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Localidad } from '../../modules/localidades/entities/localidades.entity';
import { Provincia } from '../../modules/provincias/entities/provincia.entity';
import { Repository } from 'typeorm';
import { UsersMock } from './users.mock';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Localidad)
    private readonly localidadesRepository: Repository<Localidad>,
    @InjectRepository(Provincia)
    private readonly provinciasRepository: Repository<Provincia>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    console.log('Seed users inicializado');
    await this.seed();
  }

  async seed() {
    // Obtener la provincia de Mendoza
    const provinciaSeed = await this.provinciasRepository.findOne({
      where: { nombre: 'Mendoza' },
    });

    if (!provinciaSeed) {
      console.error('No se encontró la provincia de Mendoza');
      return;
    }

    const loalidadSeed = await this.localidadesRepository.findOne({
      where: { nombre: 'Maipú' },
    });

    if (!loalidadSeed) {
      console.error('No se encontró la localidad Maipú');
      return;
    }

    for (const userMock of UsersMock) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userMock.email },
      });

      if (existingUser) {
        console.log(
          `Usuario con email ${userMock.email} ya existe, omitiendo creación.`,
        );
        return;
      }

      const hashedPassword = await bcrypt.hash(userMock.password, 10);
      const user = new User();
      Object.assign(user, userMock);
      user.password = hashedPassword;
      user.provincia = provinciaSeed;
      user.localidad = loalidadSeed;

      await this.usersRepository.save(user);
    }
  }
}
