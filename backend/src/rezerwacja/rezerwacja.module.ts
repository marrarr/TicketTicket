import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RezerwacjaController } from './rezerwacja.controller';
import { RezerwacjaService } from './rezerwacja.service';
import { Rezerwacja } from './rezerwacja.entity';
import { Log } from 'src/mongo/log.schema';
import { LogModule } from 'src/mongo/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rezerwacja]), LogModule],
  controllers: [RezerwacjaController],
  providers: [RezerwacjaService],
  exports: [RezerwacjaService],
})
export class RezerwacjaModule {}