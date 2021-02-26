import { Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthConfig implements JwtOptionsFactory {

  private secret: string

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get('secret')
  }

  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: this.secret
    }
  }

}