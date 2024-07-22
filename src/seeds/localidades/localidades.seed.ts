import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Localidad } from '../../modules/localidades/entities/localidades.entity';
import { Repository } from 'typeorm';
import { LocalidadesMock } from './localidades.mock';

@Injectable()
export class LocalidadesSeed {
  constructor(
    @InjectRepository(Localidad)
    private readonly localidadesRepository: Repository<Localidad>,
  ) {}

  async onModuleInit() {
    console.log('Seed localidades inicializado');
    await this.seed();
  }

  async seed() {
    // Obtener todos los nombres de localidades existentes de una vez
    const existingLocalidadesNames = (
      await this.localidadesRepository.find()
    ).map((localidad) => localidad.nombre);

    for (const localidadesData of LocalidadesMock) {
      if (!existingLocalidadesNames.includes(localidadesData.nombre)) {
        const localidad = new Localidad();
        localidad.nombre = localidadesData.nombre;
        await this.localidadesRepository.save(localidad);
      }
    }
  }
}
