import { PartialType } from '@nestjs/mapped-types';
import { CreateRezerwacjaDto } from './create-rezerwacja.dto';

export class UpdateRezerwacjaDto extends PartialType(CreateRezerwacjaDto) {}
