import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateRezerwacjaDto {
  @IsInt()
  salaId: number;

  @IsInt()
  siedzenieId: number;

  @IsInt()
  seansId: number;

  @IsString()
  @IsNotEmpty()
  klient: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
