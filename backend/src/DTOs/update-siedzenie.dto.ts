import { PartialType } from '@nestjs/mapped-types';
import { CreateSiedzenieDto } from './create-siedzenie.dto';

export class UpdateSiedzenieDto extends PartialType(CreateSiedzenieDto) {}
