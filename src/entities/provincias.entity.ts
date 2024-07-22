import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'provincias',
})
export class Provincias {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;
}
