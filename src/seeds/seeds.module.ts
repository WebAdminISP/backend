import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from '../modules/provincias/entities/provincia.entity';
import { ProvinciasSeed } from './provincias/provincias.seed';
import { Localidad } from 'src/modules/localidades/entities/localidades.entity';
import { LocalidadesSeed } from './localidades/localidades.seed';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersSeed } from './users/users.seed';
import { Equipo } from 'src/modules/equipos/entities/equipo.entity';
import { EquiposSeed } from './equipos/equipos.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia, Localidad, User, Equipo])],
  providers: [ProvinciasSeed, LocalidadesSeed, UsersSeed, EquiposSeed],
  exports: [ProvinciasSeed, LocalidadesSeed, UsersSeed, EquiposSeed],
})
// export class SeedsModule {}
export class SeedsModule implements OnModuleInit {
  constructor(
    private readonly provinciasSeed: ProvinciasSeed,
    private readonly localidadesSeed: LocalidadesSeed, //private readonly usersSeed: UsersSeed,
    private readonly equiposSeed: EquiposSeed, //private readonly usersSeed: UsersSeed,
  ) {}

  async onModuleInit() {
    await this.provinciasSeed.seed();
    await this.localidadesSeed.seed();
    //await this.usersSeed.seed();
    await this.equiposSeed.seed();
  }
}
