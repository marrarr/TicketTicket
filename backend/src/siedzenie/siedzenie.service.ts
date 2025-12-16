import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siedzenie } from './siedzenie.entity';
import { CreateSiedzenieDto, UpdateSiedzenieDto } from '../dtos/siedzenie.dto';

@Injectable()
export class SiedzenieService {
  constructor(
    @InjectRepository(Siedzenie)
    private repo: Repository<Siedzenie>,
  ) {}

  create(dto: CreateSiedzenieDto) {
    return this.repo.save(dto);
  }
  findAll() {
    return this.repo.find();
  }
  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
  async update(id: number, dto: UpdateSiedzenieDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
  remove(id: number) {
    return this.repo.delete(id);
  }
}