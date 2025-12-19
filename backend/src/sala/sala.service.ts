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
    try {
      await this.logService.create({
        typ_logu: 'INFO',
        typ_zdarzenia: 'REZERWACJA',
        opis: 'Rezerwacja utworzona',
        uzytkownik_id: 1,
        nazwa_uzytkownika: 'admin',
      });
    } catch (e) {
      console.error('Failed to write mongo log', e);
    }

    return this.repo.save(dto);
  }
  findAll() {
    return this.repo.find();
  }
  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
  async update(id: number, dto: UpdateSalaDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
  remove(id: number) {
    return this.repo.delete(id);
  }
}