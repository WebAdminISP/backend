import { Provincia } from '../../provincias/entities/provincia.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity({
  name: 'localidades',
})
export class Localidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @ManyToOne(() => Provincia, (provincia) => provincia.localidades)
  @JoinColumn()
  provincia: Provincia;
}
