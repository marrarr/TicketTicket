import { AppDataSource } from '../../data-source';
import { Uzytkownik } from '../../uzytkownik/uzytkownik.entity';
import { Rola } from '../../rola/rola.entity';
import * as bcrypt from 'bcryptjs';

export async function seedUzytkownicy(): Promise<void> {
  const userRepo = AppDataSource.getRepository(Uzytkownik);
  const roleRepo = AppDataSource.getRepository(Rola);

  const adminRole = await roleRepo.findOne({ where: { nazwa: 'admin' } });
  const ownerRole = await roleRepo.findOne({ where: { nazwa: 'owner' } });
  const clientRole = await roleRepo.findOne({ where: { nazwa: 'user' } });

  if (!adminRole || !ownerRole || !clientRole) {
    throw new Error('Brakuje ról w DB. Odpal najpierw seedRole().');
  }

  const passwordHash = await bcrypt.hash('URGOAT', 10);

  const users: Array<Partial<Uzytkownik>> = [
    {
      imie: 'Admin',
      nazwisko: 'System',
      email: 'admin@example.local',
      telefon: '000000000',
      login: 'admin',
      haslo: passwordHash,
      confirmed: true,
      rola_id: adminRole.id,
    },
    {
      imie: 'Kierownik',
      nazwisko: 'Kina',
      email: 'kierownik@example.local',
      telefon: '000000001',
      login: 'owner',
      haslo: passwordHash,
      confirmed: true,
      rola_id: ownerRole.id,
    },
    {
      imie: 'Miłosz',
      nazwisko: 'Test',
      email: 'milosz@example.local',
      telefon: '000000002',
      login: 'milosz',
      haslo: passwordHash,
      confirmed: true,
      rola_id: clientRole.id,
    },
    {
      imie: 'Wiktor',
      nazwisko: 'Testowy',
      email: 'wiktor@example.local',
      telefon: '000000003',
      login: 'wiktor',
      haslo: passwordHash,
      confirmed: true,
      rola_id: clientRole.id,
    },
    {
      imie: 'Radek',
      nazwisko: 'Testov',
      email: 'radek@example.local',
      telefon: '000000004',
      login: 'radek',
      haslo: passwordHash,
      confirmed: true,
      rola_id: clientRole.id,
    },
  ];

  for (const u of users) {
    // email i login są unique — biorę email jako “klucz” seedowania
    const existing = await userRepo.findOne({
      where: { email: u.email as string },
    });

    if (!existing) {
      await userRepo.save(userRepo.create(u));
      continue;
    }

    await userRepo.save(existing);
  }
}
