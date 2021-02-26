import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestQueryOptions } from '../common/dto/request-query.dto';
import { User, UserUpdate } from './dto/user.dto';
import { User as UserModel, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(UserModel.name) private readonly model: Model<UserDocument>
  ) { }

  create(data: User) {
    const createdData = new this.model(data);
    return createdData.save();
  }

  findAll(match = {}, fields = {}, options: RequestQueryOptions = {}) {
    const { sort, skip, limit } = options

    return this.model.find({ deleted: false, ...match }, fields)
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit))
  }

  findOne(match = {}, fields = {}) {
    return this.model.findOne({ deleted: false, ...match }, fields)
  }

  findById(_id: string, fields = {}) {
    return this.model.findOne({ deleted: false, _id }, fields)
  }

  count(match = {}) {
    return this.model.count({ deleted: false, ...match })
  }

  update(match = {}, data: UserUpdate) {
    return this.model.updateMany({ deleted: false, ...match }, data)
  }

  updateById(_id: string, data: UserUpdate) {
    return this.model.updateOne({ _id }, data)
  }

  remove(match = {}) {
    return this.model.deleteMany({ deleted: false, ...match})
  }

  removeById(_id) {
    return this.model.deleteOne({ deleted: false, _id })
  }

  wipe(match = {}) {
    return this.model.deleteMany(match)
  }

}
