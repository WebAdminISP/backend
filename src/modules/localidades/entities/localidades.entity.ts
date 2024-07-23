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
  @JoinColumn()
  provincia: Provincia;
}
