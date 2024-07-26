import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from '../modules/provincias/entities/provincia.entity';
import { ProvinciasSeed } from './provincias/provincias.seed';
import { Localidad } from '../modules/localidades/entities/localidades.entity';
import { LocalidadesSeed } from './localidades/localidades.seed';
import { User } from '../modules/users/entities/user.entity';
import { UsersSeed } from './users/users.seed';
import { Equipo } from '../modules/equipos/entities/equipo.entity';
import { EquiposSeed } from './equipos/equipos.seed';
import { Impuesto } from '../modules/impuestos/entities/impuesto.entity';
import { ImpuestosSeed } from './impuestos/impuestos.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provincia, Localidad, User, Equipo, Impuesto]),
  ],
  providers: [
    ProvinciasSeed,
    LocalidadesSeed,
    UsersSeed,
    EquiposSeed,
    ImpuestosSeed,
  ],
  exports: [
    ProvinciasSeed,
    LocalidadesSeed,
    UsersSeed,
    EquiposSeed,
    ImpuestosSeed,
  ],
})
// export class SeedsModule {}
export class SeedsModule implements OnModuleInit {
  constructor(
    private readonly provinciasSeed: ProvinciasSeed,
    private readonly localidadesSeed: LocalidadesSeed,
    private readonly equiposSeed: EquiposSeed,
    private readonly impuestosSeed: ImpuestosSeed,
  ) {}

  async onModuleInit() {
    await this.provinciasSeed.seed();
    await this.localidadesSeed.seed();
    //await this.usersSeed.seed();
    await this.equiposSeed.seed();
    await this.impuestosSeed.seed();
  }
}
