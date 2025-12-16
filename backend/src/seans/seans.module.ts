import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeansController } from './seans.controller';
import { SeansService } from './seans.service';
import { Seans } from './seans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seans])],
  controllers: [SeansController],
  providers: [SeansService],
  exports: [SeansService],
})
export class SeansModule {}