import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setup as SetupModel, SetupDocument } from './entities/setup.entity';

@Injectable()
export class SetupService {

    constructor(
        @InjectModel(SetupModel.name) private readonly model: Model<SetupDocument>
    ) { }

    create(data) {
        const createdData = new this.model(data);
        return createdData.save();
    }

    getSetup() {
        return this.model.findOne({})
    }

    wipe(match = {}) {
        return this.model.deleteMany(match)
    }

}
