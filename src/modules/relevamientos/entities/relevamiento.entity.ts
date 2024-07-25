import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'bigint' })
  telefono: number;

  @Column({ length: 60 })
  razon: string;

  @Column()
  direccion: string;

  @Column('double precision')
  latitud: number;

  @Column('double precision')
  longitud: number;

  @OneToMany(() => Provincia, (provincia) => provincia.relevamiento)
  provincia: Provincia[];

  @OneToMany(() => Localidad, (localidad) => localidad.relevamiento)
  localidad: Localidad[];

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
