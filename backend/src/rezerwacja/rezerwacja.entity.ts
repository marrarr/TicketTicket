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

  @ManyToOne(() => Sala)
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @ManyToOne(() => Siedzenie)
  @JoinColumn({ name: 'siedzenie_id' })
  siedzenie: Siedzenie;

  @ManyToOne(() => Seans, (s) => s.rezerwacje)
  @JoinColumn({ name: 'seans_id' })
  seans: Seans;

  @Column({ type: 'varchar' })
  klient: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ name: 'data_utworzenia', type: 'timestamp' })
  dataUtworzenia: Date;

  @Column({ name: 'uzytkownik_id' })
  uzytkownik_id: number;

  @ManyToOne(() => Uzytkownik, uzytkownik => uzytkownik.rezerwacje)
  @JoinColumn({ name: 'uzytkownik_id' })
  uzytkownik: Uzytkownik;
}
