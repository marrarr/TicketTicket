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
    return this.logModel.find().lean().exec();
  }
}