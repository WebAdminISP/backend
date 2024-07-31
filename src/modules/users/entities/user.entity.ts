// Pourpase: Entity for the user table
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { Localidad } from '../../localidades/entities/localidades.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';
import { Impuesto } from '../../impuestos/entities/impuesto.entity';

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

  @Column({ type: 'varchar' })
  telefono: string;

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

  @Column({ length: 60, nullable: true, default: 'no declarado' })
  razonSocial: string;

  @ManyToOne(() => Impuesto, (impuesto) => impuesto.users, {nullable:true})
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

  @Column({nullable:true})
  domicilioInstal: string;

  @Column({nullable:true})
  localidadInstal: string;

  @Column({ type: 'varchar', nullable: true })
  telefonoInstal: string;

  @Column({nullable:true})
  emailInstal: string;

  @Column({nullable:true})
  observaciones: string;

  @Column({nullable:true})
  senalConexion: string;

  @OneToMany(() => Equipo, (equipo) => equipo.user,{nullable:true})
  equipos: Equipo[];

  @OneToMany(() => Servicio, (servicio) => servicio.user,{nullable:true})
  servicios: Servicio[];
}
