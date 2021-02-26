import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestQueryOptions } from '../common/dto/request-query.dto';
import { Purchase, PurchaseUpdate } from './dto/purchase.dto';
import { Purchase as PurchaseModel, PurchaseDocument } from './entities/purchase.entity';
import { PurchaseStatus } from '../common/enum'

@Injectable()
export class PurchaseService {

  constructor(
    @InjectModel(PurchaseModel.name) private readonly model: Model<PurchaseDocument>
  ) { }

  create(data: Purchase) {
    const createdData = new this.model(data);
    return createdData.save();
  }

  findAll(match = {}, fields = {}, options: RequestQueryOptions = {}) {
    const { sort, skip, limit } = options

    return this.model.find({ deleted: false, ...match }, fields)
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit));
  }

  findOne(match = {}, fields = {}) {
    return this.model.findOne({ deleted: false, ...match }, fields);
  }

  findById(_id: string, fields = {}) {
    return this.model.findOne({ deleted: false, _id }, fields);
  }

  count(match = {}) {
    return this.model.count({ deleted: false, ...match });
  }

  update(match = {}, data: PurchaseUpdate) {
    return this.model.updateMany({
      deleted: false,
      status: PurchaseStatus.IN_VALIDATION,
      ...match
    }, data);
  }

  updateById(_id: string, data: PurchaseUpdate) {
    return this.model.updateOne({
      _id,
      deleted: false,
      status: PurchaseStatus.IN_VALIDATION
    }, data);
  }

  remove(match = {}) {
    return this.model.deleteMany({
      deleted: false,
      status: PurchaseStatus.IN_VALIDATION,
      ...match
    });
  }

  removeById(_id) {
    return this.model.deleteOne({
      _id,
      deleted: false,
      status: PurchaseStatus.IN_VALIDATION
    });
  }

  wipe(match = {}) {
    return this.model.deleteMany({ ...match})
  }

}
