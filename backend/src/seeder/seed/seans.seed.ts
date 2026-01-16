import { AppDataSource } from '../../data-source';
import { Sala } from '../../sala/sala.entity';
import { Seans } from '../../seans/seans.entity';
import * as fs from 'fs';
import * as path from 'path';

function randHex(len = 32) {
  return Array(len)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
}

export async function seedSeanse(): Promise<void> {
  const salaRepo = AppDataSource.getRepository(Sala);
  const seansRepo = AppDataSource.getRepository(Seans);

  const sale = await salaRepo.find();
  if (sale.length === 0) return;

  const filmy = [
    'Matrix',
    'Incepcja',
    'Interstellar',
    'Blade Runner 2049',
    'Diuna',
    'Batman',
    'Zaplatani',
  ];

  const posterMap: Record<string, string> = {
    matrix: 'plakat-matrix.jpg',
    incepcja: 'plakat-incepcja.jpg',
    interstellar: 'plakat-interstellar.jpg',
    'blade runner 2049': 'plakat-blade-runner.jpg',
    diuna: 'plakat-diuna.jpg',
    batman: 'plakat-batman.jpg',
    zaplatani: 'plakat-zaplatani.jpg',
  };

  const godziny = ['12:00', '16:00', '20:00']; // trzy filmy dziennie

  const seedDir = __dirname; // plakaty są w tym folderze
  const uploadsDir = path.join(process.cwd(), 'uploads');
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const start = new Date('2026-01-05');
  const end = new Date('2026-01-25');

  // iterujemy po dniach (włącznie)
  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const dataISO = d.toISOString().split('T')[0];

    // Dla każdego dnia wybieramy maksymalnie `godziny.length` unikalnych filmów
    // i tworzymy po jednym seansie dla każdej godziny (razem ~3 seanse dziennie).
    // Sala jest dobierana rotacyjnie z listy sal, żeby nie tworzyć seansów w każdej sali.
    const filmsPool = [...filmy];
    for (let i = filmsPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filmsPool[i], filmsPool[j]] = [filmsPool[j], filmsPool[i]];
    }

    const chosenFilms = filmsPool.slice(0, Math.min(godziny.length, filmsPool.length));

    for (let gi = 0; gi < chosenFilms.length; gi++) {
      const godzina = godziny[gi];
      const tytulFilmu = chosenFilms[gi];

      // wybieramy salę rotacyjnie (zapewnia rozkład seansów po salach)
      const sala = sale[(d.getDate() + gi) % sale.length];

      const exists = await seansRepo.exist({
        where: {
          sala: { id: sala.id },
          data: dataISO,
          godzinaRozpoczecia: godzina,
        },
      });

      if (exists) continue;

      const key = tytulFilmu.toLowerCase();
      const posterName = posterMap[key] || null;
      let savedPosterFilename: string | null = null;

      if (posterName) {
        try {
          const src = path.join(seedDir, posterName);
          const ext = path.extname(posterName) || '.jpg';
          const destName = `${randHex(32)}${ext}`;
          const dest = path.join(uploadsDir, destName);
          await fs.promises.copyFile(src, dest);
          savedPosterFilename = destName;
        } catch (err) {
          console.warn('Nie udało się skopiować plakatu', posterName, err);
          savedPosterFilename = null;
        }
      }

      const seans = seansRepo.create({
        sala,
        data: dataISO,
        godzinaRozpoczecia: godzina,
        tytulFilmu,
        okladkaUrl: savedPosterFilename ?? undefined,
      });

      await seansRepo.save(seans);
    }
  }
}
