// seans.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeansController } from './seans.controller';
import { SeansService } from './seans.service';
import { Seans } from './seans.entity';
import { Sala } from '../sala/sala.entity';
import { Siedzenie } from '../siedzenie/siedzenie.entity';
// 1. IMPORTUJEMY REZERWACJĘ
import { Rezerwacja } from '../rezerwacja/rezerwacja.entity'; 

@Module({
  imports: [
    // 2. DODAJEMY JĄ DO FOR FEATURE
    TypeOrmModule.forFeature([Seans, Sala, Siedzenie, Rezerwacja]), 
  ],
  controllers: [SeansController],
  providers: [SeansService],
  exports: [SeansService],
})
export class SeansModule {}