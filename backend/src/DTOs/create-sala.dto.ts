import { IsInt, Min } from 'class-validator';

export class CreateSalaDto {
  @IsInt()
  @Min(1)
  numerSali: number;

  @IsInt()
  @Min(1)
  iloscMiejsc: number;
}
