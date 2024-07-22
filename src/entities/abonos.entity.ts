import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'abonos',
})
export class Abonos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;
}
