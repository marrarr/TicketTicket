import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './log.schema';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  create(payload: Partial<Log>) {
    return this.logModel.create(payload);
  }

  findAll() {
    return this.logModel.find({ data: -1 }).lean().exec();
  }

  findByType(typ_zdarzenia: string) {
    return this.logModel
      .find({ typ_zdarzenia })
      .sort({ data: -1 })
      .lean()
      .exec();
  }

  findByUser(uzytkownik_id: number) {
    return this.logModel
      .find({ uzytkownik_id })
      .sort({ data: -1 })
      .lean()
      .exec();
  }

  findBySeans(seans_id: number) {
    return this.logModel
      .find({ seans_id })
      .sort({ data: -1 })
      .lean()
      .exec();
  }
}