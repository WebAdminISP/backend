import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Localidad } from '../../localidades/entities/localidades.entity';
import { User } from '../../users/entities/user.entity';
import { Relevamiento } from '../../relevamientos/entities/relevamiento.entity';

@Entity({
  name: 'provincias',
})
export class Provincia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @OneToMany(() => User, (user) => user.provincia)
  users: User[];

  @OneToMany(() => Localidad, (localidad) => localidad.provincia)
  localidades: Localidad[];

  @ManyToOne(() => Relevamiento, (relevamiento) => relevamiento.provincia)
  @JoinColumn({ name: 'relevamientoId' })
  relevamiento: Relevamiento;
}
