import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig implements MongooseOptionsFactory {
  
    constructor(private configService: ConfigService) {}

    createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
        return this.configService.get('database');
    }
}