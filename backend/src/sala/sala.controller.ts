import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SalaService } from './sala.service';
import type { CreateSalaDto, UpdateSalaDto } from '../dtos/sala.dto';

@Controller('sale')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  create(@Body() dto: CreateSalaDto) {
    return this.salaService.create(dto);
  }

  @Get()
  findAll() {
    return this.salaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.salaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSalaDto) {
    return this.salaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.salaService.remove(id);
  }
}
