import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CashbackBandDocument = CashbackBand & Document;

@Schema()
export class CashbackBand {
    @Prop({})
    _id: undefined

    @Prop({ required: true, min: 0 })
    min: number

    @Prop({ required: true, min: 0 })
    max: number

    @Prop({ required: true, min: 0 })
    percent: number
}

export const CashbackBandSchema = SchemaFactory.createForClass(CashbackBand);

