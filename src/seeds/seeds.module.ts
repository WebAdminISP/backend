import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from '../modules/provincias/entities/provincia.entity';
import { ProvinciasSeed } from './provincias/provincias.seed';
import { Localidad } from 'src/modules/localidades/entities/localidades.entity';
import { LocalidadesSeed } from './localidades/localidades.seed';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersSeed } from './users/users.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia, Localidad, User])],
  providers: [ProvinciasSeed, LocalidadesSeed, UsersSeed],
  exports: [ProvinciasSeed, LocalidadesSeed, UsersSeed],
})
// export class SeedsModule {}
export class SeedsModule implements OnModuleInit {
  constructor(
    private readonly provinciasSeed: ProvinciasSeed,
    private readonly localidadesSeed: LocalidadesSeed,
    private readonly usersSeed: UsersSeed,
  ) {}

  async onModuleInit() {
    await this.provinciasSeed.seed();
    await this.localidadesSeed.seed();
    //await this.usersSeed.seed();
  }
}
