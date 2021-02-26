import { HttpModuleOptions, HttpModuleOptionsFactory, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {

  private boticario

  constructor(private configService: ConfigService) {
    this.boticario = this.configService.get('boticario')
  }

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: this.boticario.host,
      headers: {
        token: this.boticario.token
      }
    };
  }

}