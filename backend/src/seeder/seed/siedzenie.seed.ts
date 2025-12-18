import { AppDataSource } from '../../data-source';
import { Sala } from '../../sala/sala.entity';
import { Siedzenie } from '../../siedzenie/siedzenie.entity';

export async function seedSiedzenia(): Promise<void> {
  const siedzenieRepo = AppDataSource.getRepository(Siedzenie);
  const salaRepo = AppDataSource.getRepository(Sala);

  const RZEDY = 12;
  const MIEJSCA_W_RZEDZIE = 14;

  const sale = await salaRepo.find();

  for (const sala of sale) {
    // sprawdzamy czy sala już ma siedzenia
    const ileIstnieje = await siedzenieRepo.count({
      where: { sala: { id: sala.id } },
    });

    if (ileIstnieje > 0) {
      continue; // nie duplikujemy
    }

    const siedzenia: Siedzenie[] = [];

    for (let rzad = 1; rzad <= RZEDY; rzad++) {
      for (let numer = 1; numer <= MIEJSCA_W_RZEDZIE; numer++) {
        siedzenia.push(
          siedzenieRepo.create({
            rzad,
            numer,
            sala,
          }),
        );
      }
    }

    await siedzenieRepo.save(siedzenia);
  }
}
