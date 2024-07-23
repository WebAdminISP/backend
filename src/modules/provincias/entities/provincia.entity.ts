import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Localidad } from '../../localidades/entities/localidades.entity';
import { User } from '../../users/entities/user.entity';

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
}
