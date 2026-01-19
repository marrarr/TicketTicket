import { AppDataSource } from '../../data-source';
import { Rezerwacja } from '../../rezerwacja/rezerwacja.entity';
import { Seans } from '../../seans/seans.entity';
import { Siedzenie } from '../../siedzenie/siedzenie.entity';
import { Uzytkownik } from '../../uzytkownik/uzytkownik.entity';
import * as mongoose from 'mongoose';
import { LogSchema } from '../../mongo/log.schema';

export async function seedRezerwacje(): Promise<void> {
  const rezerwacjaRepo = AppDataSource.getRepository(Rezerwacja);
  const seansRepo = AppDataSource.getRepository(Seans);
  const siedzenieRepo = AppDataSource.getRepository(Siedzenie);
  const uzytkownikRepo = AppDataSource.getRepository(Uzytkownik);

  const seanse = await seansRepo.find({ relations: ['sala'] });
  const uzytkownicy = await uzytkownikRepo.find();

  
  const allowedLogins = ['milosz', 'radek', 'wiktor'];
  const dostępniUzytkownicy = uzytkownicy.filter((u) =>
    allowedLogins.includes((u.login || '').toString().toLowerCase()),
  );

  if (seanse.length === 0 || dostępniUzytkownicy.length === 0) {
    console.log('Brak seansów lub brak docelowych użytkowników (milosz, radek, wiktor). Pomiń seedowanie rezerwacji.');
    return;
  }

  
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketticket';
  let LogModel: any = null;
  try {
    await mongoose.connect(mongoUri);
    LogModel = mongoose.models.Log || mongoose.model('Log', LogSchema);
  } catch (err) {
    console.warn('Nie udało się połączyć z MongoDB — logi rezerwacji nie będą zapisywane', err);
    LogModel = null;
  }

  for (const seans of seanse) {
    const istnieje = await rezerwacjaRepo.findOne({
      where: { seans: { id: seans.id } },
    });
    if (istnieje) continue;

    const dataSeansu = new Date(seans.data);
    const dzienTygodnia = dataSeansu.getDay(); 

    
    const czyPopularnyDzien = dzienTygodnia === 1 || dzienTygodnia === 2;

    
    
    const procentZajecia = czyPopularnyDzien
      ? Math.floor(Math.random() * (90 - 70 + 1) + 70)
      : Math.floor(Math.random() * (15 - 5 + 1) + 5);

    const wszystkieSiedzenia = await siedzenieRepo.find({
      where: { sala: { id: seans.sala.id } },
    });

    const liczbaMiejscDoRezerwacji = Math.floor(
      (procentZajecia / 100) * wszystkieSiedzenia.length,
    );

    
    const wybraneSiedzenia = wszystkieSiedzenia
      .sort(() => 0.5 - Math.random())
      .slice(0, liczbaMiejscDoRezerwacji);

    const noweRezerwacje: Rezerwacja[] = [];

      for (const siedzenie of wybraneSiedzenia) {
      const uzytkownik =
        dostępniUzytkownicy[Math.floor(Math.random() * dostępniUzytkownicy.length)];
      noweRezerwacje.push(
        rezerwacjaRepo.create({
          seans: seans,
          sala: seans.sala,
          siedzenie: siedzenie,
          uzytkownik: uzytkownik,
          klient: `${uzytkownik.imie} ${uzytkownik.nazwisko}`,
          status: 'potwierdzona',
          dataUtworzenia: new Date(),
        }),
      );
    }

    
    if (noweRezerwacje.length > 0) {
      const saved = await rezerwacjaRepo.save(noweRezerwacje);

      
      if (LogModel) {
        try {
          const logs = saved.map((r: Rezerwacja) => ({
            typ_logu: 'INFO',
            typ_zdarzenia: 'REZERWACJA',
            opis: `Rezerwacja ${r.klient} seans:${r.seans?.id} siedzenie:${r.siedzenie?.rzad}-${r.siedzenie?.numer}`,
            seans_id: r.seans?.id,
            nazwa_uzytkownika: (r.uzytkownik as any)?.login,
            uzytkownik_id: (r.uzytkownik as any)?.id,
          }));

          if (logs.length > 0) {
            await LogModel.insertMany(logs);
          }
        } catch (err) {
          console.warn('Błąd przy zapisywaniu logów rezerwacji do Mongo', err);
        }
      }
    }
  }
}
