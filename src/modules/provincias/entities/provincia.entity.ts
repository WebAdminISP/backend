import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Localidad } from '../../localidades/entities/localidades.entity';

@Entity({
  name: 'provincias',
})
export class Provincia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @OneToMany(() => Localidad, (localidad) => localidad.provincia)
  localidades: Localidad[]; // Cambié el nombre de 'localidad' a 'localidades' para ser más descriptivo
}
