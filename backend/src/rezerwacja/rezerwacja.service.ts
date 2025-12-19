import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Rezerwacja } from './rezerwacja.entity';
import type { CreateRezerwacjaDto, UpdateRezerwacjaDto } from '../dtos/rezerwacja.dto';
import { LogService } from 'src/mongo/log.service';

@Injectable()
export class RezerwacjaService {
  constructor(
    @InjectRepository(Rezerwacja)
    private repo: Repository<Rezerwacja>,
    private logService: LogService,
    private dataSource: DataSource,
  ) {}

  private getIds(dto: any) {
    return {
      salaId: dto.salaId ?? dto.sala_id,
      siedzenieId: dto.siedzenieId ?? dto.siedzenie_id,
      seansId: dto.seansId ?? dto.seans_id,
      uzytkownikId: dto.uzytkownikId ?? dto.uzytkownik_id,
    };
  }

  async create(dto: CreateRezerwacjaDto) {
    const { salaId, siedzenieId, seansId, uzytkownikId } = this.getIds(
      dto as any,
    );

    const payload: Partial<Rezerwacja> = {
      klient: (dto as any).klient,
      status: (dto as any).status,
      dataUtworzenia: new Date(),
    };

    if (salaId) payload.sala = { id: salaId } as any;
    if (siedzenieId) payload.siedzenie = { id: siedzenieId } as any;
    if (seansId) payload.seans = { id: seansId } as any;
    if (uzytkownikId)
      payload.uzytkownik = { uzytkownik_id: uzytkownikId } as any;

    const saved = await this.repo.save(payload as Rezerwacja);

    try {
      await this.logService.create({
        typ_logu: 'INFO',
        typ_zdarzenia: 'REZERWACJA',
        opis: `Rezerwacja id=${saved.id}`,
        seans_id: seansId,
        uzytkownik_id: uzytkownikId,
        nazwa_uzytkownika: saved.klient,
      });
    } catch (e) {
      console.error('Failed to write mongo log', e);
    }

    return saved;
  }

  findAll() {
    return this.repo.find({
      relations: ['sala', 'siedzenie', 'seans', 'uzytkownik'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['sala', 'siedzenie', 'seans', 'uzytkownik'],
    });
  }

  async update(id: number, dto: UpdateRezerwacjaDto) {
    const { salaId, siedzenieId, seansId, uzytkownikId } = this.getIds(
      dto as any,
    );

    const payload: any = { id };
    if ((dto as any).klient !== undefined) payload.klient = (dto as any).klient;
    if ((dto as any).status !== undefined) payload.status = (dto as any).status;

    if (salaId) payload.sala = { id: salaId } as any;
    if (siedzenieId) payload.siedzenie = { id: siedzenieId } as any;
    if (seansId) payload.seans = { id: seansId } as any;
    if (uzytkownikId)
      payload.uzytkownik = { uzytkownik_id: uzytkownikId } as any;

    await this.repo.save(payload);
    return this.findOne(id);
  }

  async remove(id: number) {
    try {
      const rezerwacja = await this.findOne(id);
      if (rezerwacja) {
        await this.logService.create({
          typ_logu: 'WARNING',
          typ_zdarzenia: 'ANULOWANIE_REZERWACJI',
          opis: `Anulowano rezerwację #${id}.}"`,
          seans_id: rezerwacja.seans?.id,
          uzytkownik_id: rezerwacja.uzytkownik?.uzytkownik_id,
          nazwa_uzytkownika: rezerwacja.klient,
        });
      }
    } catch (e) {
      console.error('Failed to write mongo log', e);
    }

    return this.repo.delete(id);
  }

  async createProcedura(dto: CreateRezerwacjaDto) {
    const { salaId, siedzenieId, seansId, uzytkownikId } = this.getIds(
      dto as any,
    );

    const klient = (dto as any).klient;
    const status = (dto as any).status;

    try {
      await this.dataSource.query(
          'CALL zloz_rezerwacje(?, ?, ?, ?, ?, ?)',
          [salaId, siedzenieId, seansId, klient, status, uzytkownikId],
      );
      try {
        await this.logService.create({
          typ_logu: 'INFO',
          typ_zdarzenia: 'REZERWACJA',
          opis: 'Rezerwacja utworzona',
          seans_id: seansId,
          uzytkownik_id: uzytkownikId,
          nazwa_uzytkownika: klient,
        });
      } catch (e) {
        console.error('Failed to write mongo log', e);
      }
    } catch (err: any) {
      if (err?.sqlState === '45000') {
        throw new Error('Miejsce jest już zajęte');
      }

      console.error('Błąd podczas wywołania procedury zloz_rezerwacje', err);
      throw err;
    }
  }
}