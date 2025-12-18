import { AppDataSource } from '../../data-source';
import { Sala } from '../../sala/sala.entity';
import { Seans } from '../../seans/seans.entity';

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
  ];

  const godziny = ['10:00', '13:30', '17:00', '20:30'];

  const dni = 5;

  for (let d = 0; d < dni; d++) {
    const data = new Date();
    data.setDate(data.getDate() + d);
    const dataISO = data.toISOString().split('T')[0];

    for (const sala of sale) {
      for (const godzina of godziny) {
        const tytulFilmu = filmy[(d + sala.id) % filmy.length];

        const exists = await seansRepo.exist({
          where: {
            sala: { id: sala.id },
            data: dataISO,
            godzinaRozpoczecia: godzina,
          },
        });

        if (exists) continue;

        await seansRepo.save(
          seansRepo.create({
            sala,
            data: dataISO,
            godzinaRozpoczecia: godzina,
            tytulFilmu,
          }),
        );
      }
    }
  }
}
