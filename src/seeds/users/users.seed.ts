import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Localidad } from '../../modules/localidades/entities/localidades.entity';
import { Provincia } from '../../modules/provincias/entities/provincia.entity';
import { Repository } from 'typeorm';
import { UsersMock } from './users.mock';
import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Impuesto } from '../../modules/impuestos/entities/impuesto.entity';
import { Equipo } from '../../modules/equipos/entities/equipo.entity';
import { Servicio } from '../../modules/servicios/entities/servicio.entity';
import { Factura } from '../../modules/facturacion/entities/facturacion.entity';

@Injectable()
export class UsersSeed {
  constructor(
    @InjectRepository(Localidad)
    private readonly localidadesRepository: Repository<Localidad>,
    @InjectRepository(Provincia)
    private readonly provinciasRepository: Repository<Provincia>,
    @InjectRepository(Impuesto)
    private readonly impuestosRepository: Repository<Impuesto>,
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
    @InjectRepository(Servicio)
    private readonly serviciosRepository: Repository<Servicio>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Factura)
    private readonly facturasRepository: Repository<Factura>,
  ) {}

  async seed() {
    console.log('Seed users inicializado');
    const provinciaSeed = await this.provinciasRepository.findOne({
      where: { nombre: 'Mendoza' },
    });

    if (!provinciaSeed) {
      console.error('No se encontró la provincia de Mendoza');
      return;
    }

    const localidadSeed = await this.localidadesRepository.findOne({
      where: { nombre: 'Maipú' },
    });

    if (!localidadSeed) {
      console.error('No se encontró la localidad Maipú');
      return;
    }

    const impuestoSeed = await this.impuestosRepository.findOne({
      where: { nombre: 'Monotributo' },
    });

    if (!impuestoSeed) {
      console.error('No se encontro el impuesto: Monotributo');
      return;
    }

    const equipoSeed = await this.equiposRepository.findOne({
      where: { equipo: 'NanoLoco M5' },
    });

    if (!equipoSeed) {
      console.error('No se encontro el equipo: NanoLoco M5');
      return;
    }

    const servicioSeed = await this.serviciosRepository.findOne({
      where: { nombre: '100/35' },
    });

    if (!servicioSeed) {
      console.error('No se encontro el servicio: 100/35');
      return;
    }

    const facturaSeed = await this.facturasRepository.findOne({
      where: { concepto: '6/2' },
    });

    if (!facturaSeed) {
      console.error('No se encontro el concepto: 6/2');
      return;
    }

    for (const userMock of UsersMock) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userMock.email },
      });

      if (existingUser) {
        return;
      }

      const hashedPassword = await bcrypt.hash(userMock.password, 10);
      const user = new User();
      Object.assign(user, userMock);
      user.password = hashedPassword;
      user.provincia = provinciaSeed;
      user.localidad = localidadSeed;
      user.impuesto = impuestoSeed;
      user.equipos = [equipoSeed];
      user.servicios = [servicioSeed];
      user.facturas = [facturaSeed];

      console.log('Creando usuario: ', user.nombre);
      await this.usersRepository.save(user);
    }
  }
}
