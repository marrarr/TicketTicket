import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('logi')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @Get('rezerwacje')
  findRezerwacje() {
    return this.logService.findByType('REZERWACJA');
  }

  @Get('logowania')
  findLogowania() {
    return this.logService.findByType('LOGOWANIE');
  }

  @Get('rejestracje')
  findRejestracje() {
    return this.logService.findByType('REJESTRACJA');
  }
}
