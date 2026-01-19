import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from './sala.entity';
import { CreateSalaDto, UpdateSalaDto } from '../dtos/sala.dto';
import { LogService } from '../mongo/log.service';

@Injectable()
export class SalaService {
  constructor(
    @InjectRepository(Sala)
    private repo: Repository<Sala>,
    private logService: LogService,
  ) {}

  async create(dto: CreateSalaDto) {
    const saved = await this.repo.save(dto);

    try {
      await this.logService.create({
        typ_logu: 'INFO',
        typ_zdarzenia: 'DODANIE_SALI',
        opis: `Dodano salę id=${(saved as any).id}`,
        nazwa_uzytkownika: (dto as any).nazwa_uzytkownika,
      });
    } catch (e) {
      console.error('Failed to write mongo log', e);
    }

    return saved;
  }
  findAll() {
    return this.repo.find();
  }
  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
  async update(id: number, dto: UpdateSalaDto) {
    await this.repo.update(id, dto);
    const updated = await this.findOne(id);

    try {
      await this.logService.create({
        typ_logu: 'INFO',
        typ_zdarzenia: 'EDYCJA_SALI',
        opis: `Edytowano salę id=${id}`,
        nazwa_uzytkownika: (dto as any).nazwa_uzytkownika,
      });
    } catch (e) {
      console.error('Failed to write mongo log', e);
    }

    return updated;
  }
  remove(id: number) {
    return this.repo.findOneBy({ id }).then(async (existing) => {
      try {
        if (existing) {
          await this.logService.create({
            typ_logu: 'WARNING',
            typ_zdarzenia: 'USUNIECIE_SALI',
            opis: `Usunięto salę id=${id}`,
            nazwa_uzytkownika: undefined,
          });
        }
      } catch (e) {
        console.error('Failed to write mongo log', e);
      }
      return this.repo.delete(id);
    });
  }
}