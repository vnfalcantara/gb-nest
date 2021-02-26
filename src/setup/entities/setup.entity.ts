import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CashbackBand } from './cashback-band.entity';

export type SetupDocument = Setup & Document;

@Schema()
export class Setup {
    @Prop({ default: [] })
    autoApprove: Array<string>

    @Prop({ default: [] })
    cashbackBands: Array<CashbackBand>
}

export const SetupSchema = SchemaFactory.createForClass(Setup);

