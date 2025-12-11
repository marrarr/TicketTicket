import { IsString, IsInt, IsDateString, Matches } from 'class-validator';

export class CreateSeansDto {
  @IsString()
  tytulFilmu: string;

  @IsInt()
  salaId: number;

  @IsDateString()
  data: string;

  @IsString()
  @Matches(/^([01]\\d|2[0-3]):([0-5]\\d)$/, {
    message: 'godzinaRozpoczecia musi być w formacie HH:mm',
  })
  godzinaRozpoczecia: string;
}
