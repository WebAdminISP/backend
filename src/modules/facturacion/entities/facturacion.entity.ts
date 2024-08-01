import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
  name: 'facturacion',
})
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.facturas, { nullable: false })
  user: User;

  @Column({ length: 50, nullable: false })
  agente: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  fechaGen: Date;

  @Column({ length: 50, nullable: false })
  concepto: string;

  @Column({ nullable: false })
  observaciones: string;

  @Column({ nullable: false })
  numFactura: number;

  @Column({ nullable: false })
  tipoPago: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  fechaVencimiento: Date;
}
