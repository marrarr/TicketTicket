import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sala } from '../sala/sala.entity';
import { Siedzenie } from '../siedzenie/siedzenie.entity';
import { Seans } from '../seans/seans.entity';
import { Uzytkownik } from 'src/uzytkownik/uzytkownik.entity';

@Entity('rezerwacja')
export class Rezerwacja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sala, { onDelete: 'CASCADE' })  // ← dodaj
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @ManyToOne(() => Siedzenie, { onDelete: 'CASCADE' })  // ← dodaj
  @JoinColumn({ name: 'siedzenie_id' })
  siedzenie: Siedzenie;

  @ManyToOne(() => Seans, (s) => s.rezerwacje, { onDelete: 'CASCADE' })  // ← dodaj
  @JoinColumn({ name: 'seans_id' })
  seans: Seans;

  @Column({ type: 'varchar' })
  klient: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ name: 'data_utworzenia', type: 'timestamp' })
  dataUtworzenia: Date;

  @ManyToOne(() => Uzytkownik, uzytkownik => uzytkownik.rezerwacje, { onDelete: 'SET NULL' })  // ← SET NULL dla użytkownika
  @JoinColumn({ name: 'uzytkownik_id' })
  uzytkownik: Uzytkownik;
}