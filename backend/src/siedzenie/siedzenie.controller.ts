import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SiedzenieService } from './siedzenie.service';
import type { CreateSiedzenieDto, UpdateSiedzenieDto } from '../dtos/siedzenie.dto';

@Controller('siedzenia')
export class SiedzenieController {
  constructor(private readonly siedzenieService: SiedzenieService) {}

  @Post()
  create(@Body() dto: CreateSiedzenieDto) {
    return this.siedzenieService.create(dto);
  }

  @Get()
  findAll() {
    return this.siedzenieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.siedzenieService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSiedzenieDto) {
    return this.siedzenieService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.siedzenieService.remove(id);
  }
}