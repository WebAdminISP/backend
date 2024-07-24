import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({
  name: 'equipos',
})
export class Equipo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  agente: string;

  @Column()
  ipPc?: string;

  @Column()
  ipAp?: string;

  @Column()
  mascaraSubRed?: string;

  @Column()
  puertaEnlace?: string;

  @Column()
  dns1?: string;

  @Column()
  dns2?: string;

  @Column()
  nodo?: string;

  @Column({ nullable: false })
  equipo: string;

  @Column()
  cableMts: string;

  @Column({ nullable: false })
  macEquipo: string;

  @Column()
  antena?: string;

  @OneToMany(() => User, (user) => user.equipo)
  users?: User[];
}
