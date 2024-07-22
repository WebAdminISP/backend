import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'localidades',
})
export class Localidades {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;
}
