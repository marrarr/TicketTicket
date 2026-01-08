import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RezerwacjaService } from './rezerwacja.service';
import type {
  CreateRezerwacjaDto,
  UpdateRezerwacjaDto,
} from '../dtos/rezerwacja.dto';

@Controller('rezerwacje')
export class RezerwacjaController {
  constructor(private readonly rezerwacjaService: RezerwacjaService) {}

  @Post()
  create(@Body() dto: CreateRezerwacjaDto) {
    // return this.rezerwacjaService.createProcedura(dto);
    return this.rezerwacjaService.create(dto);
  }

  @Get()
  findAll() {
    return this.rezerwacjaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rezerwacjaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRezerwacjaDto) {
    return this.rezerwacjaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rezerwacjaService.remove(id);
  }
}
