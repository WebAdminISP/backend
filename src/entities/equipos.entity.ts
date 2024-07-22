import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'equipos',
})
export class Equiposs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;
}
