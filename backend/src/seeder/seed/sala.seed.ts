import { AppDataSource } from '../../data-source';
import { Sala } from '../../sala/sala.entity';

export async function seedSale(): Promise<void> {
  const salaRepo = AppDataSource.getRepository(Sala);
  const iloscRekordow = 5;
  const numerSaliStart = 100;
  const iloscMiejsc = 168;  // 12 * 14 (rzędy * miejsca w rzędzie)

  for (let i = 1; i <= iloscRekordow; ++i) {
    const numerSali = i * numerSaliStart;
    const istniejacyRekord = await salaRepo.exists({
      where: { numerSali },
    });

    if (!istniejacyRekord) {
      await salaRepo.save(
        salaRepo.create({
          numerSali: numerSali,
          iloscMiejsc: iloscMiejsc,
        })
      );
    }
  }
}
