import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipo } from '../../modules/equipos/entities/equipo.entity';
import { Repository } from 'typeorm';
import { EquiposMock } from './equipos.mock';

@Injectable()
//export class LocalidadesSeed implements OnModuleInit {
export class LocalidadesSeed {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
  ) {}

  async seed() {
    console.log('Seed equipos inicializado');

    // Obtener todos los nombres de equipos existentes de una vez
    const existingEquiposMac = (await this.equiposRepository.find()).map(
      (equipo) => equipo.macEquipo,
    );

    for (const equiposData of EquiposMock) {
      if (!existingEquiposMac.includes(equiposData.macEquipo)) {
        const equipo = new Equipo();
        await this.equiposRepository.save(equipo);
        console.log(`Equipo ${equipo.nombre} guardado`);
      }
    }
  }
}
