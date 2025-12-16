import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiedzenieController } from './siedzenie.controller';
import { SiedzenieService } from './siedzenie.service';
import { Siedzenie } from './siedzenie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Siedzenie])],
  controllers: [SiedzenieController],
  providers: [SiedzenieService],
  exports: [SiedzenieService],
})
export class SiedzenieModule {}