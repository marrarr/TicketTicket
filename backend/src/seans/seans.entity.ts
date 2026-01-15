import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Sala } from '../sala/sala.entity';
import { Rezerwacja } from '../rezerwacja/rezerwacja.entity';

@Entity('seans')
export class Seans {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tytul_filmu', type: 'varchar' })
  tytulFilmu: string;

  @Column({ name: 'okladka_url', type: 'varchar', nullable: true })
  okladkaUrl: string;

  @ManyToOne(() => Sala, (s) => s.seanse, { onDelete: 'CASCADE' })  // ← dodaj to
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @Column({ type: 'date' })
  data: string;

  @Column({ name: 'godzina_rozpoczecia', type: 'varchar' })
  godzinaRozpoczecia: string;

  @OneToMany(() => Rezerwacja, (r) => r.seans)
  rezerwacje: Rezerwacja[];
}