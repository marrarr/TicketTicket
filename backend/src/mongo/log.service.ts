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
    const result =  this.logModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log(result);
    return result;
  }

  findByType(typ_zdarzenia: string) {
    return this.logModel
      .find({ typ_zdarzenia })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  findByUser(uzytkownik_id: number) {
    return this.logModel
      .find({ uzytkownik_id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  findBySeans(seans_id: number) {
    return this.logModel
      .find({ seans_id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}