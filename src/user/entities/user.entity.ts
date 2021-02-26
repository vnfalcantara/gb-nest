import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt'

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    name: string

    @Prop({ required: true, unique: true })
    cpf: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true, select: false })
    password: string

    @Prop({ default: false })
    deleted: Boolean

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

/*
UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(password, salt)

    return hash
}
*/

UserSchema.methods.validatePassword = function <UserDocument>(password) {
    return bcrypt.compare(password, this.password)
}

UserSchema.pre<UserDocument>('save', async function (next) {
    const salt = await bcrypt.genSalt(5)
    const hash = await bcrypt.hash(this.password, salt)

    this.password = hash
    next()
})