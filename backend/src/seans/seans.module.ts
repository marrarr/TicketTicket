
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeansController } from './seans.controller';
import { SeansService } from './seans.service';
import { Seans } from './seans.entity';
import { Sala } from '../sala/sala.entity';
import { Siedzenie } from '../siedzenie/siedzenie.entity';

import { Rezerwacja } from '../rezerwacja/rezerwacja.entity'; 
import { LogModule } from '../mongo/log.module';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([Seans, Sala, Siedzenie, Rezerwacja]), 
    LogModule,
  ],
  controllers: [SeansController],
  providers: [SeansService],
  exports: [SeansService],
})
export class SeansModule {}