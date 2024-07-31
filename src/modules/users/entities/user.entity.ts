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
  
    @ManyToOne(() => Impuesto, (impuesto) => impuesto.users, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'impuestoId' })
    impuesto: Impuesto;

    @ManyToOne(() => Provincia, (provincia) => provincia.users, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'provinciaId' })
    provincia: Provincia;

    @ManyToOne(() => Localidad, (localidad) => localidad.users, { nullable: true, onDelete: 'SET NULL' })
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
  
    @OneToMany(() => Equipo, (equipo) => equipo.user)
    equipos: Equipo[];
  
    @OneToMany(() => Servicio, (servicio) => servicio.user)
    servicios: Servicio[];
  }
  