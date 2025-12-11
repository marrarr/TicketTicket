import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sala } from './sala.entity';

@Entity('siedzenie')
export class Siedzenie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  numer: number;

  @Column({ type: 'integer' })
  rzad: number;

  @ManyToOne(() => Sala, (s) => s.siedzenia, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;
}
