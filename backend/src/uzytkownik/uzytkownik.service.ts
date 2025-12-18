import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uzytkownik } from '../uzytkownik/uzytkownik.entity';
import { CreateUzytkownikDto, UpdateUzytkownikDto } from '../dtos/uzytkownik.dto';
import * as bcrypt from 'bcryptjs';

// Interface dla błędów PostgreSQL
interface PostgresError extends Error {
    code?: string;
    detail?: string;
}

@Injectable()
export class UzytkownikService {
  constructor(
    @InjectRepository(Uzytkownik)
    private readonly uzytkownikRepository: Repository<Uzytkownik>,
  ) { }

  async create(createUzytkownikDto: CreateUzytkownikDto): Promise<Uzytkownik> {
    try {
        console.log('Tworzenie użytkownika z DTO:', createUzytkownikDto);
        
        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(createUzytkownikDto.haslo, 10);
        console.log('Hasło zahashowane');
        
        // Tworzenie obiektu użytkownika
        const uzytkownik = this.uzytkownikRepository.create({
            ...createUzytkownikDto,
            haslo: hashedPassword,
            rola: { rola_id: createUzytkownikDto.rola_id }
        });
        
        console.log('Zapisywanie użytkownika do bazy...');
        const savedUser = await this.uzytkownikRepository.save(uzytkownik);
        console.log('Użytkownik zapisany:', savedUser);
        
        return savedUser;
    } catch (err) {
        console.error('Błąd w create():', err);
        
        const error = err as PostgresError;
        
        // Szczegółowa obsługa błędów bazy danych
        if (error.code === '23505') {
            // UNIQUE constraint violation
            throw new BadRequestException('Użytkownik o tym loginie lub emailu już istnieje');
        }
        
        if (error.code === '23502') {
            // NOT NULL constraint violation
            throw new BadRequestException('Brakuje wymaganych pól');
        }
        
        if (error.code === '23503') {
            // FOREIGN KEY constraint violation
            throw new BadRequestException('Nieprawidłowa rola użytkownika (rola_id nie istnieje)');
        }
        
        // Ogólny błąd
        throw new BadRequestException(
            `Nie udało się utworzyć użytkownika: ${error.message || 'Nieznany błąd'}`
        );
    }
  }

  async findAll(): Promise<Uzytkownik[]> {
    return await this.uzytkownikRepository.find({
      relations: ['rola'],
    });
  }

  async findOneByUsername(username: string): Promise<Uzytkownik> {
    const uzytkownik = await this.uzytkownikRepository.findOne({
      where: { login: username },
      relations: ['rola'],
    });
    if (!uzytkownik) {
      throw new NotFoundException(`Użytkownik: ${username} nie znaleziony`);
    }
    return uzytkownik;
  }

  async upsert(id: number, updateUzytkownikDto: UpdateUzytkownikDto): Promise<Uzytkownik> {
    const uzytkownik = await this.uzytkownikRepository.findOne({
      where: { uzytkownik_id: id },
    });

    if (uzytkownik) {
      // Jeśli aktualizujemy hasło, należy je zahashować
      if (updateUzytkownikDto.haslo) {
        updateUzytkownikDto.haslo = await bcrypt.hash(updateUzytkownikDto.haslo, 10);
      }
      Object.assign(uzytkownik, updateUzytkownikDto);
      return await this.uzytkownikRepository.save(uzytkownik);
    } else {
      // Przy tworzeniu nowego użytkownika też hashujemy hasło
      if (updateUzytkownikDto.haslo) {
        updateUzytkownikDto.haslo = await bcrypt.hash(updateUzytkownikDto.haslo, 10);
      }
      const newUzytkownik = this.uzytkownikRepository.create({
        uzytkownik_id: id,
        ...updateUzytkownikDto,
      });
      return await this.uzytkownikRepository.save(newUzytkownik);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.uzytkownikRepository.delete({ uzytkownik_id: id });
    if (result.affected === 0) {
      throw new NotFoundException(`Użytkownik z ID ${id} nie znaleziony`);
    }
  }
}