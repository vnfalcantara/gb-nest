import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthConfig } from './auth.config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: AuthConfig
    }),

    PassportModule,

    UserModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    { provide: 'bcrypt', useFactory: () => require('bcrypt') }
  ],
  controllers: [AuthController]
})
export class AuthModule { }
