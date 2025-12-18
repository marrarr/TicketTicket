import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UzytkownikService } from '../uzytkownik/uzytkownik.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUzytkownikDto } from 'src/dtos/uzytkownik.dto';
import { LogService } from '../mongo/log.service';

// Interface dla błędów PostgreSQL
interface PostgresError extends Error {
    code?: string;
    detail?: string;
}

@Injectable()
export class AuthService {
    constructor(
      private users: UzytkownikService, 
      private jwt: JwtService, 
      private logService: LogService
    ) { }

    async register(createUzytkownikDto: CreateUzytkownikDto) {
        console.log('Rejestracja użytkownika:', createUzytkownikDto);
        
        try {
            const uzytkownik = await this.users.create(createUzytkownikDto);
            console.log('Użytkownik utworzony:', uzytkownik);

            // LOGOWANIE REJESTRACJI
            try {
              await this.logService.create({
                typ_logu: 'INFO',
                typ_zdarzenia: 'REJESTRACJA',
                opis: `Nowe konto: ${uzytkownik.login}`,
                nazwa_uzytkownika: uzytkownik.login,
                uzytkownik_id: uzytkownik.uzytkownik_id,
              });
            } catch (e) {
              console.error('Failed to write mongo log', e);
            }
            
            return { 
                username: uzytkownik.login,
                message: 'Użytkownik został pomyślnie zarejestrowany'
            };
        } catch (err) {
            console.error('Błąd podczas rejestracji:', err);
            
            const error = err as PostgresError;
            
            // Sprawdź czy to błąd duplikatu (UNIQUE constraint)
            if (error.code === '23505') {
                throw new BadRequestException('Użytkownik o tym loginie lub emailu już istnieje');
            }
            
            // Sprawdź czy to błąd NOT NULL constraint
            if (error.code === '23502') {
                throw new BadRequestException('Brakuje wymaganych pól');
            }
            
            // Sprawdź czy to błąd FOREIGN KEY constraint
            if (error.code === '23503') {
                throw new BadRequestException('Nieprawidłowa rola użytkownika');
            }
            
            // Ogólny błąd
            throw new BadRequestException(
                error.message || 'Nie udało się utworzyć użytkownika'
            );
        }
    }

    async login(username: string, password: string) {
      const user = await this.users.findOneByUsername(username);
      if (!user) {
        // LOGOWANIE NIEUDANEJ PRÓBY
        try {
          await this.logService.create({
            typ_logu: 'WARNING',
            typ_zdarzenia: 'LOGOWANIE',
            opis: `Nieudana próba logowania: użytkownik nie istnieje`,
            nazwa_uzytkownika: username,
          });
        } catch (e) {
          console.error('Failed to write mongo log', e);
        }
        throw new UnauthorizedException('Użytkownik nie znaleziony');
      }

      const valid = await bcrypt.compare(password, user.haslo);
      if (!valid) {
        // LOGOWANIE ZŁEGO HASŁA
        try {
          await this.logService.create({
            typ_logu: 'WARNING',
            typ_zdarzenia: 'LOGOWANIE',
            opis: `Nieudana próba logowania: błędne hasło`,
            nazwa_uzytkownika: username,
            uzytkownik_id: user.uzytkownik_id,
          });
        } catch (e) {
          console.error('Failed to write mongo log', e);
        }
        throw new UnauthorizedException('Nieprawidłowe hasło');
      }

      // LOGOWANIE UDANEGO LOGOWANIA
      try {
        await this.logService.create({
          typ_logu: 'INFO',
          typ_zdarzenia: 'LOGOWANIE',
          opis: `Użytkownik zalogował się pomyślnie`,
          nazwa_uzytkownika: username,
          uzytkownik_id: user.uzytkownik_id,
        });
      } catch (e) {
        console.error('Failed to write mongo log', e);
      }

      const payload = {
        username: user.login,
        sub: user.uzytkownik_id,
        role: user.rola?.nazwa,
      };
      return { access_token: this.jwt.sign(payload) };
    }
}