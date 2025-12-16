import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'log' })
export class Log {
  @Prop() typ_logu: string;
  @Prop() typ_zdarzenia: string;
  @Prop() opis: string;
  @Prop({ default: () => new Date() }) data: Date;
  @Prop() seans_id?: number;
  @Prop() nazwa_rezerwujacego?: string;
}

export type LogDocument = Log & Document;
export const LogSchema = SchemaFactory.createForClass(Log);