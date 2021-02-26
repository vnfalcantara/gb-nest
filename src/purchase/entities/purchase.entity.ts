import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PurchaseStatus, PurchaseStatusEnum } from '../../common/enum';

export type PurchaseDocument = Purchase & Document;

@Schema()
export class Purchase {
    @Prop({ required: true })
    code: string
    
    @Prop({ required: true, min: 0 })
    price: number

    @Prop({ min: 0, max: 100, default: 0 })
    cashback: number

    @Prop({ min: 0, default: 0 })
    cashbackValue: number

    @Prop({ required: true })
    user: string

    @Prop({ required: true, enum: PurchaseStatusEnum, default: PurchaseStatus.IN_VALIDATION })
    status: string

    @Prop({ default: false })
    deleted: Boolean

    @Prop({})
    added_to_queue: Date;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);

PurchaseSchema.pre<PurchaseDocument>('save', async function(next) {
    let document = this

    document.cashbackValue = document.cashback
        ? (document.price * document.cashback) / 100
        : 0
    
    next()
})