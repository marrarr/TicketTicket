import { Injectable, BadRequestException } from '@nestjs/common'; // Dodaj BadRequestException
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

  // ... Twoje istniejące metody (create, findAll, findOne, update, remove, createProcedura) ...
  
  // ==================================================================
  // NOWA METODA: Rezerwacja grupowa w transakcji
  // ==================================================================
  async createMany(dto: any) {
    // Oczekujemy obiektu:
    // {
    //   salaId: 1, seansId: 2, klient: "Jan", uzytkownikId: 1,
    //   siedzeniaIds: [10, 11, 12]  <-- Tablica ID miejsc
    // }

    const { salaId, seansId, uzytkownikId } = this.getIds(dto);
    const siedzeniaIds: number[] = dto.siedzeniaIds || [];
    const klient = dto.klient;

    if (!siedzeniaIds.length) {
      throw new BadRequestException('Nie wybrano żadnych miejsc.');
    }

    // Uruchamiamy QueryRunner dla transakcji
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const savedReservations: Rezerwacja[] = [];

    try {
      // 1. Pętla zapisu wewnątrz transakcji SQL
      for (const nrMiejsca of siedzeniaIds) {
        // Tworzymy encję
        const rezerwacja = new Rezerwacja();
        rezerwacja.klient = klient;
        rezerwacja.status = 'REZERWACJA';
        rezerwacja.dataUtworzenia = new Date();
        rezerwacja.sala = { id: salaId } as any;
        rezerwacja.seans = { id: seansId } as any;
        rezerwacja.uzytkownik = { uzytkownik_id: uzytkownikId } as any;
        
        // Kluczowe: przypisanie konkretnego numeru miejsca z listy
        rezerwacja.siedzenie = { id: nrMiejsca } as any;

        // Zapisujemy używając managera transakcji (nie this.repo!)
        const saved = await queryRunner.manager.save(rezerwacja);
        savedReservations.push(saved);
      }

      // 2. Jeśli wszystko poszło OK, zatwierdzamy zmiany w SQL
      await queryRunner.commitTransaction();

    } catch (err) {
      // 3. Jeśli wystąpił błąd (np. duplikat), wycofujemy WSZYSTKO
      await queryRunner.rollbackTransaction();
      console.error('Błąd transakcji rezerwacji:', err);
      throw new BadRequestException('Jedno z miejsc jest już zajęte lub wystąpił błąd zapisu.');
    } finally {
      // 4. Zwalniamy połączenie
      await queryRunner.release();
    }

    // 5. Logowanie do Mongo (poza transakcją SQL, żeby nie spowalniać bazy)
    // Możemy dodać jeden log zbiorczy lub pętlę
    try {
      await this.logService.create({
        typ_logu: 'INFO',
        typ_zdarzenia: 'REZERWACJA_GRUPOWA',
        opis: `Zarezerwowano ${savedReservations.length} miejsc: [${siedzeniaIds.join(', ')}]`,
        seans_id: seansId,
        uzytkownik_id: uzytkownikId,
        nazwa_uzytkownika: klient,
      });
    } catch (e) {
      console.error('Failed to write mongo log', e);
    }

    return savedReservations;
  }
  
  // ... reszta Twojego kodu ...
  // upewnij się, że metody create, findAll itd. zostają w pliku
  async create(dto: CreateRezerwacjaDto) {
      // ... Twoja stary kod create ...
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
}