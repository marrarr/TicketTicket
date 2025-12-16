import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seans } from './seans.entity';
import { CreateSeansDto, UpdateSeansDto } from '../dtos/seans.dto';

@Injectable()
export class SeansService {
  constructor(
    @InjectRepository(Seans)
    private repo: Repository<Seans>,
  ) {}

  create(dto: CreateSeansDto) { return this.repo.save(dto); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneBy({ id }); }
  async update(id: number, dto: UpdateSeansDto) { await this.repo.update(id, dto); return this.findOne(id); }
  remove(id: number) { return this.repo.delete(id); }
}