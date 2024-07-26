import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provincia } from 'src/modules/provincias/entities/provincia.entity';
import { Localidad } from 'src/modules/localidades/entities/localidades.entity';

@Entity({
  name: 'relevamientos',
})
export class Relevamiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  fechaIngreso: Date;

  @Column({ length: 50, nullable: false })
  agente: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'bigint', nullable: false })
  telefono: number;

  @Column({ length: 60 })
  razon: string;

  @Column({ nullable: false })
  direccion: string;

  @Column('double precision', { nullable: false })
  latitud: number;

  @Column('double precision', { nullable: false })
  longitud: number;

  @ManyToOne(() => Provincia, (provincia) => provincia.relevamiento)
  @JoinColumn({ name: 'provinciaId' })
  provincia: Provincia;

  @ManyToOne(() => Localidad, (localidad) => localidad.relevamiento)
  @JoinColumn({ name: 'localidadId' })
  localidad: Localidad;

  @Column()
  diaCliente: string;

  @Column()
  horarios: string;

  @Column()
  domicilioInstal: string;

  @Column()
  localidadInstal: string;

  @Column()
  emailInstal: string;

  @Column()
  observaciones: string;
}
