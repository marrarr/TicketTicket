import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SeansService } from './seans.service';
import type { CreateSeansDto, UpdateSeansDto } from '../dtos/seans.dto';

@Controller('seans')
export class SeansController {
  constructor(private readonly seansService: SeansService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('okladka', {
      storage: diskStorage({
        destination: './uploads', // Folder docelowy (musi istnieć!)
        filename: (req, file, cb) => {
          // Generujemy unikalną nazwę pliku (np. losowyCiągZnaków.jpg)
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateSeansDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Jeśli plik został przesłany, dopisujemy jego nazwę do DTO
    if (file) {
      (dto as any).okladkaUrl = file.filename;
    }
    return this.seansService.create(dto);
  }

  @Get()
  findAll() {
    return this.seansService.findAll();
  }

  // --- NOWY ENDPOINT ---
  // Służy do pobierania mapy sali z uwzględnieniem rezerwacji TYLKO dla tego seansu.
  // Użycie: GET http://localhost:3000/seans/15/miejsca
  @Get(':id/miejsca')
  getMiejsca(@Param('id') id: number) {
    return this.seansService.getMiejscaSeansu(id);
  }
  // ---------------------

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