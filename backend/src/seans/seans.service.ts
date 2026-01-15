import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seans } from './seans.entity';
import { Sala } from '../sala/sala.entity';
import { Siedzenie } from '../siedzenie/siedzenie.entity';
// WAŻNE: Import Rezerwacji
import { Rezerwacja } from '../rezerwacja/rezerwacja.entity';
import { CreateSeansDto, UpdateSeansDto } from '../dtos/seans.dto';

@Injectable()
export class SeansService {
  constructor(
    @InjectRepository(Seans)
    private seansRepo: Repository<Seans>,

    @InjectRepository(Sala)
    private salaRepo: Repository<Sala>,

    @InjectRepository(Siedzenie)
    private siedzenieRepo: Repository<Siedzenie>,

    // WAŻNE: Wstrzyknięcie repozytorium rezerwacji
    @InjectRepository(Rezerwacja)
    private rezerwacjaRepo: Repository<Rezerwacja>,
  ) {}

  async create(dto: CreateSeansDto) {
    const sala = await this.salaRepo.findOne({ where: { id: dto.salaId } });

    if (!sala) {
      throw new NotFoundException(`Nie znaleziono sali o ID ${dto.salaId}`);
    }

    // Tworzenie seansu z przypisaniem obiektu Sali
    const nowySeans = new Seans();
    nowySeans.tytulFilmu = dto.tytulFilmu;
    nowySeans.data = dto.data;
    nowySeans.godzinaRozpoczecia = dto.godzinaRozpoczecia;
    nowySeans.sala = sala;

    // --- ZMIANA TUTAJ: Zapisujemy URL okładki jeśli został przesłany ---
    if ((dto as any).okladkaUrl) {
      nowySeans.okladkaUrl = (dto as any).okladkaUrl;
    }
    // ------------------------------------------------------------------

    const zapisanySeans = await this.seansRepo.save(nowySeans);

    // Generowanie miejsc (sprawdzenie czy sala ma zdefiniowaną pojemność)
    const pojemnosc = (sala as any).iloscMiejsc || (sala as any).pojemnosc || 0;

    // Sprawdzamy czy w tej sali są już wygenerowane siedzenia, jeśli nie - tworzymy je
    const liczbaMiejscWSali = await this.siedzenieRepo.count({
      where: { sala: { id: sala.id } },
    });

    if (liczbaMiejscWSali === 0 && pojemnosc > 0) {
      await this.generujMiejsca(sala, pojemnosc);
    }

    return zapisanySeans;
  }

  private async generujMiejsca(sala: Sala, iloscMiejsc: number) {
    const siedzeniaDoZapisu: Siedzenie[] = [];
    for (let i = 1; i <= iloscMiejsc; i++) {
      const siedzenie = new Siedzenie();
      siedzenie.numer = i;
      siedzenie.rzad = Math.ceil(i / 10);
      siedzenie.sala = sala;
      siedzeniaDoZapisu.push(siedzenie);
    }
    await this.siedzenieRepo.save(siedzeniaDoZapisu);
  }

  // --- NOWA METODA, KTÓREJ BRAKOWAŁO ---
  async getMiejscaSeansu(seansId: number) {
    // 1. Znajdź seans, żeby wiedzieć jaka to sala
    const seans = await this.seansRepo.findOne({
      where: { id: seansId },
      relations: ['sala'],
    });

    if (!seans) {
      throw new NotFoundException(`Nie znaleziono seansu o ID ${seansId}`);
    }

    // Sprawdź czy seans ma przypisaną salę
    if (!seans.sala) {
      throw new NotFoundException(
        `Seans o ID ${seansId} nie ma przypisanej sali`,
      );
    }

    // 2. Pobierz wszystkie fizyczne siedzenia z tej sali
    const wszystkieSiedzenia = await this.siedzenieRepo.find({
      where: { sala: { id: seans.sala.id } },
      order: { numer: 'ASC' },
    });

    // 3. Pobierz rezerwacje TYLKO dla tego konkretnego seansu
    const rezerwacjeNaTenSeans = await this.rezerwacjaRepo.find({
      where: { seans: { id: seansId } },
      relations: ['siedzenie'],
    });

    // 4. Stwórz listę ID zajętych siedzeń (z filtrowaniem null)
    const zajeteSiedzeniaIds = rezerwacjeNaTenSeans
      .filter((r) => r.siedzenie !== null && r.siedzenie !== undefined)
      .map((r) => r.siedzenie.id);

    // 5. Zwróć listę siedzeń z flagą czy wolne
    return wszystkieSiedzenia.map((siedzenie) => ({
      id: siedzenie.id,
      numer: siedzenie.numer,
      rzad: siedzenie.rzad,
      // Miejsce jest wolne, jeśli nie ma go na liście rezerwacji tego seansu
      czyWolne: !zajeteSiedzeniaIds.includes(siedzenie.id),
    }));
  }
  // --------------------------------------

  findAll() {
    return this.seansRepo.find({ relations: ['sala'] });
  }

  findOne(id: number) {
    return this.seansRepo.findOne({
      where: { id },
      relations: ['sala'],
    });
  }

  async update(id: number, dto: UpdateSeansDto) {
    const updateData: any = {};

    if (dto.tytulFilmu !== undefined) updateData.tytulFilmu = dto.tytulFilmu;
    if (dto.data !== undefined) updateData.data = dto.data;
    if (dto.godzinaRozpoczecia !== undefined)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.godzinaRozpoczecia = dto.godzinaRozpoczecia;

    // KONWERSJA salaId → sala: { id }
    if (dto.salaId !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updateData.sala = { id: dto.salaId };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.seansRepo.update(id, updateData);
  }

  remove(id: number) {
    return this.seansRepo.delete(id);
  }
}