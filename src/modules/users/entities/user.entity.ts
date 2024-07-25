// Pourpase: Entity for the user table
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { Localidad } from '../../localidades/entities/localidades.entity';
import { Equipo } from 'src/modules/equipos/entities/equipo.entity';
import { Servicio } from 'src/modules/servicios/entities/servicio.entity';
import { Impuesto } from 'src/modules/impuestos/entities/impuesto.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({ length: 50, nullable: false })
  agente: string;

  @Column({ length: 50, nullable: false })
  nombre: string;

  @Column({ type: 'bigint' })
  telefono: number;

  @Column()
  direccion: string;

  @Column('double precision')
  latitud: number;

  @Column('double precision')
  longitud: number;

  @Column()
  documento: number;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 60 })
  razonSocial: string;

  @ManyToOne(() => Impuesto, (impuesto) => impuesto.users)
  @JoinColumn({ name: 'impuestoId' })
  impuesto: Impuesto;

  @ManyToOne(() => Provincia, (provincia) => provincia.users)
  @JoinColumn({ name: 'provinciaId' })
  provincia: Provincia;

  @ManyToOne(() => Localidad, (localidad) => localidad.users)
  @JoinColumn({ name: 'localidadId' })
  localidad: Localidad;

  @Column()
  codigoPostal: string;

  @Column()
  domicilioInstal: string;

  @Column()
  localidadInstal: string;

  @Column()
  telefonoInstal: number;

  @Column()
  emailInstal: string;

  @Column()
  observaciones: string;

  @Column()
  senalConexion: string;

  @ManyToOne(() => Equipo, (equipo) => equipo.users)
  @JoinColumn({ name: 'equipoId' })
  equipo: Equipo;

  @ManyToOne(() => Servicio, (servicio) => servicio.users)
  @JoinColumn({ name: 'servicioId' })
  servicio: Servicio;
}
