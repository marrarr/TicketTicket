import { AppDataSource } from '../../data-source';
import { Rezerwacja } from '../../rezerwacja/rezerwacja.entity';
import { Seans } from '../../seans/seans.entity';
import { Siedzenie } from '../../siedzenie/siedzenie.entity';
import { Uzytkownik } from '../../uzytkownik/uzytkownik.entity';

export async function seedRezerwacje(): Promise<void> {
  const rezerwacjaRepo = AppDataSource.getRepository(Rezerwacja);
  const seansRepo = AppDataSource.getRepository(Seans);
  const siedzenieRepo = AppDataSource.getRepository(Siedzenie);
  const uzytkownikRepo = AppDataSource.getRepository(Uzytkownik);

  const seanse = await seansRepo.find({ relations: ['sala'] });
  const uzytkownicy = await uzytkownikRepo.find();

  if (seanse.length === 0 || uzytkownicy.length === 0) {
    console.log('Brak seansów lub użytkowników. Pomiń seedowanie rezerwacji.');
    return;
  }

  for (const seans of seanse) {
    const istnieje = await rezerwacjaRepo.findOne({
      where: { seans: { id: seans.id } },
    });
    if (istnieje) continue;

    const dataSeansu = new Date(seans.data);
    const dzienTygodnia = dataSeansu.getDay(); // 0 (Nd) do 6 (So)

    // Poniedziałek to 1, Wtorek to 2
    const czyPopularnyDzien = dzienTygodnia === 1 || dzienTygodnia === 2;

    // Ustalamy ile miejsc zajmujemy
    // Popularne dni: 70-90% sali, reszta: 5-15%
    const procentZajecia = czyPopularnyDzien
      ? Math.floor(Math.random() * (90 - 70 + 1) + 70)
      : Math.floor(Math.random() * (15 - 5 + 1) + 5);

    const wszystkieSiedzenia = await siedzenieRepo.find({
      where: { sala: { id: seans.sala.id } },
    });

    const liczbaMiejscDoRezerwacji = Math.floor(
      (procentZajecia / 100) * wszystkieSiedzenia.length,
    );

    // Tasujemy siedzenia, żeby rezerwacje nie były tylko w pierwszych rzędach
    const wybraneSiedzenia = wszystkieSiedzenia
      .sort(() => 0.5 - Math.random())
      .slice(0, liczbaMiejscDoRezerwacji);

    const noweRezerwacje: Rezerwacja[] = [];

    for (const siedzenie of wybraneSiedzenia) {
      const uzytkownik =
        uzytkownicy[Math.floor(Math.random() * uzytkownicy.length)];

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

    // Zapisujemy paczkami, żeby było szybciej
    if (noweRezerwacje.length > 0) {
      await rezerwacjaRepo.save(noweRezerwacje);
    }
  }
}
