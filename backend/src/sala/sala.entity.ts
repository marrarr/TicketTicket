import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Siedzenie } from '../siedzenie/siedzenie.entity';
import { Seans } from '../seans/seans.entity';

@Entity('sala')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'numer_sali', type: 'integer', unique: true })
  numerSali: number;

  @Column({ name: 'ilosc_miejsc', type: 'integer' })
  iloscMiejsc: number;

  @OneToMany(() => Siedzenie, (s) => s.sala)
  siedzenia: Siedzenie[];

  @OneToMany(() => Seans, (s) => s.sala)
  seanse: Seans[];
}
