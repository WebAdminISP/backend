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

  @Column({ length: 50 })
  razonSocial: string;

  @Column()
  impuesto: string;

  @ManyToOne(() => Provincia, (provincia) => provincia.localidades)
  @JoinColumn({ name: 'provinciaId' })
  provincia: Provincia;

  @ManyToOne(() => Localidad, (localidad) => localidad.provincia)
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

  @Column()
  equiposId: string;

  @Column()
  serviciosId: string;
}
