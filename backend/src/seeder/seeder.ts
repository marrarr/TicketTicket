import { AppDataSource } from '../data-source';
import { seedRole } from './seed/rola.seed';
import { seedUzytkownicy } from './seed/uzytkownik.seed';
import { seedSale } from './seed/sala.seed';
import { seedSiedzenia } from './seed/siedzenie.seed';
import { seedSeanse } from './seed/seans.seed';
import {seedRezerwacje} from "./seed/rezerwacja.seed";

async function runSeeder() {
  try {
    console.log('--- Inicjalizacja połączenia z bazą danych... ---');
    await AppDataSource.initialize();
    console.log('Połączono pomyślnie.');

    console.log('--- Seedowanie ról... ---');
    await seedRole();

    console.log('--- Seedowanie użytkowników... ---');
    await seedUzytkownicy();

    console.log('--- Seedowanie sal... ---');
    await seedSale();

    console.log('--- Seedowanie siedzeń... ---');
    await seedSiedzenia();

    console.log('--- Seedowanie seansów... ---');
    await seedSeanse();

    console.log('--- Seedowanie rezerwacji... ---');
    await seedRezerwacje();

    console.log('--- Seedowanie zakończone sukcesem! ---');
  } catch (error) {
    console.error('Błąd podczas seedowania danych:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeder();
