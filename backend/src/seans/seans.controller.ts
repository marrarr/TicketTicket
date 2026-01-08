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

@Controller('seanse')
export class SeansController {
  constructor(private readonly seansService: SeansService) {}

  @Post()
@UseInterceptors(
  FileInterceptor('okladka', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }),
)
async create(
  @Body() dto: CreateSeansDto,
  @UploadedFile() file: Express.Multer.File,
) {
  const seansData: any = {
    tytulFilmu: dto.tytulFilmu,
    data: dto.data,
    godzinaRozpoczecia: dto.godzinaRozpoczecia,
    salaId: typeof dto.salaId === 'string' ? parseInt(dto.salaId, 10) : dto.salaId,  // ← POPRAWKA
  };

  if (file) {
    seansData.okladkaUrl = file.filename;
  }

  return this.seansService.create(seansData);
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
     console.log(dto);
     console.log(" uwu!");
    return this.seansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.seansService.remove(id);
  }
}