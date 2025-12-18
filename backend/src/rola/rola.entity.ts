import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Uzytkownik } from '../uzytkownik/uzytkownik.entity';

@Entity('rola')
export class Rola {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nazwa: string;

  @OneToMany(() => Uzytkownik, uzytkownik => uzytkownik.rola)
  uzytkownik: Uzytkownik[];
}
