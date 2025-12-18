import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'log',
  timestamps: true,
})
export class Log {
  @Prop({
    required: true,
    enum: ['INFO', 'WARNING', 'ERROR'],
  })
  typ_logu: string;

  @Prop({
    required: true,
    ENUM: ['REZERWACJA', 'LOGOWANIE', 'WYLOGOWANIE', 'REJESTRACJA'],
  })
  typ_zdarzenia: string;

  @Prop({
    required: true,
  })
  opis: string;

  @Prop({
    type: Date,
    default: () => new Date(),
    index: true,
  })
  data: Date;

  @Prop({
    type: Number,
    required: false,
  })
  seans_id?: number;

  @Prop({
    required: false,
  })
  nazwa_rezerwujacego?: string;

  @Prop({
    type: Number,
    required: false,
  })
  uzytkownik_id?: number;
}

export type LogDocument = Log & Document;
export const LogSchema = SchemaFactory.createForClass(Log);

LogSchema.index({ typ_zdarzenia: 1, data: -1 });
LogSchema.index({ uzytkownik_id: 1, data: -1 });