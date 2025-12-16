import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SeansService } from './seans.service';
import type { CreateSeansDto, UpdateSeansDto } from '../dtos/seans.dto';

@Controller('seans')
export class SeansController {
  constructor(private readonly seansService: SeansService) {}

  @Post()
  create(@Body() dto: CreateSeansDto) {
    return this.seansService.create(dto);
  }

  @Get()
  findAll() {
    return this.seansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.seansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSeansDto) {
    return this.seansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.seansService.remove(id);
  }
}