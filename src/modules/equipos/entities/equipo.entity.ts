import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({
  name: 'equipos',
})
export class Equipo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  agente: string;

  @Column({ nullable: false })
  ipPc: string;

  @Column({ nullable: false })
  ipAp: string;

  @Column({ nullable: false })
  mascaraSubRed: string;

  @Column({ nullable: false })
  puertaEnlace: string;

  @Column({ nullable: false })
  dns1: string;

  @Column({ nullable: false })
  dns2: string;

  @Column({ nullable: false })
  nodo: string;

  @Column({ nullable: false })
  equipo: string;

  @Column({ nullable: false })
  macEquipo: string;

  @Column({ nullable: false })
  antena: string;

  @ManyToOne(() => User, (user) => user.equipos)
  @JoinColumn()
  user: User;
}
