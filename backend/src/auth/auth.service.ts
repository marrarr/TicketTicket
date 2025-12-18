import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UzytkownikService } from '../uzytkownik/uzytkownik.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUzytkownikDto } from 'src/dtos/uzytkownik.dto';

// Interface dla błędów PostgreSQL
interface PostgresError extends Error {
    code?: string;
    detail?: string;
}

@Injectable()
export class AuthService {
    constructor(private users: UzytkownikService, private jwt: JwtService) { }

    async register(createUzytkownikDto: CreateUzytkownikDto) {
        console.log('Rejestracja użytkownika:', createUzytkownikDto);
        
        try {
            const uzytkownik = await this.users.create(createUzytkownikDto);
            console.log('Użytkownik utworzony:', uzytkownik);
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
        if (!user) throw new UnauthorizedException('Użytkownik nie znaleziony');

        const valid = await bcrypt.compare(password, user.haslo);
        if (!valid) throw new UnauthorizedException('Nieprawidłowe hasło');

        const payload = { 
            username: user.login, 
            sub: user.uzytkownik_id, 
            role: user.rola?.nazwa 
        };
        return { access_token: this.jwt.sign(payload) };
    }
}