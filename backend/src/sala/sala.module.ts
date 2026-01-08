import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaController } from './sala.controller';
import { SalaService } from './sala.service';
import { Sala } from './sala.entity';
import {LogModule} from "../mongo/log.module";

@Module({
  imports: [TypeOrmModule.forFeature([Sala]), LogModule],
  controllers: [SalaController],
  providers: [SalaService],
  exports: [SalaService],
})
export class SalaModule {}