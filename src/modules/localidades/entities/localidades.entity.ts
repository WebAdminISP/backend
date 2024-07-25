import { User } from 'src/modules/users/entities/user.entity';
import { Provincia } from '../../provincias/entities/provincia.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Relevamiento } from 'src/modules/relevamientos/entities/relevamiento.entity';

@Entity({
  name: 'localidades',
})
export class Localidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @OneToMany(() => User, (user) => user.localidad)
  users: User[];

  @ManyToOne(() => Provincia, (provincia) => provincia.localidades)
  @JoinColumn({ name: 'provinciaId' })
  provincia: Provincia;

  @ManyToOne(() => Relevamiento, (relevamiento) => relevamiento.localidad)
  @JoinColumn({ name: 'localidadId' })
  relevamiento: Relevamiento;
}
