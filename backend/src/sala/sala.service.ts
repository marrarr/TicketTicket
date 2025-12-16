import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from './sala.entity';
import { CreateSalaDto, UpdateSalaDto } from '../dtos/sala.dto';

@Injectable()
export class SalaService {
  constructor(
    @InjectRepository(Sala)
    private repo: Repository<Sala>,
  ) {}

  create(dto: CreateSalaDto) { return this.repo.save(dto); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id }); }
  async update(id: number, dto: UpdateSalaDto) { await this.repo.update(id, dto); return this.findOne(id); }
  remove(id: number) { return this.repo.delete(id); }
}