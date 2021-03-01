import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [
    UserService,
    { provide: 'bcrypt', useFactory: () => require('bcrypt') }
  ],
  controllers: [UserController],
  exports: [UserService]
})

export class UserModule {

  constructor(private userService: UserService) {
    this.bootStrap()
  }

  async bootStrap() {
    let email = 'user@email.com'
    let user

    if (process.env.NODE_ENV !== 'test') {
      user = await this.userService.findOne({email})

      if (!user) {
        await this.userService.create({
          email,
          name: 'Novo Usuario',
          password: '123456',
          cpf: '15350946056'
        })  
    }}
  }

}
