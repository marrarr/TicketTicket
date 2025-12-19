import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'log',
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Log {
  @Prop({
    required: true,
    enum: ['INFO', 'WARNING', 'ERROR'],
  })
  typ_logu: string;

  @Prop({
    required: true,
    enum: [
      'LOGOWANIE',
      'WYLOGOWANIE',
      'REJESTRACJA',
      'REZERWACJA',
      'ANULOWANIE_REZERWACJI',
      'DODANIE_SEANSU',
      'EDYCJA_SEANSU',
      'USUNIECIE_SEANSU',
      'DODANIE_SALI',
      'EDYCJA_SALI',
      'USUNIECIE_SALI',
    ],
  })
  typ_zdarzenia: string;

  @Prop({
    required: true,
  })
  opis: string;

  @Prop({
    type: Number,
    required: false,
  })
  seans_id?: number;

  @Prop({
    required: false,
  })
  nazwa_uzytkownika?: string;

  @Prop({
    type: Number,
    required: false,
  })
  uzytkownik_id?: number;
}

export type LogDocument = Log & Document;
export const LogSchema = SchemaFactory.createForClass(Log);

LogSchema.index({ typ_zdarzenia: 1, createdAt: -1 });
LogSchema.index({ uzytkownik_id: 1, createdAt: -1 });
LogSchema.index({ seans_id: 1, createdAt: -1 });
