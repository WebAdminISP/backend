import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'impuestos',
})
export class Impuestos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  nombre: string;
}
