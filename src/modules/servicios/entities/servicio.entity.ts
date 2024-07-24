import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({
  name: 'servicios',
})
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  agente: string;

  @Column({ nullable: false })
  velocidadBajada: string;

  @Column({ nullable: false })
  velocidadSubida: string;

  @Column({ nullable: false })
  costoConexion: string;

  @Column({ nullable: false })
  abono: string;

  @OneToMany(() => User, (user) => user.servicio)
  users: User[];
}
