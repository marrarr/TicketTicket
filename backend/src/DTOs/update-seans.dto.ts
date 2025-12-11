import { PartialType } from '@nestjs/mapped-types';
import { CreateSeansDto } from './create-seans.dto';

export class UpdateSeansDto extends PartialType(CreateSeansDto) {}
