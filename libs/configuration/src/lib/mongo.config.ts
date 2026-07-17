import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { Logger } from '@nestjs/common';

export class MongoConfiguration {
  @IsString()
  @IsNotEmpty()
  URL: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsNumber()
  @IsOptional()
  POOL_SIZE: number;

  @IsNumber()
  @IsOptional()
  CONNECT_TIMEOUT_MS: number;

  @IsNumber()
  @IsOptional()
  SOCKET_TIMEOUT_MS: number;

  constructor(data?: Partial<MongoConfiguration>) {
    this.URL = data?.URL || process.env['MONGODB_URI'] || '';
    this.DB_NAME = data?.DB_NAME || process.env['MONGODB_DB_NAME'] || '';
    this.POOL_SIZE = data?.POOL_SIZE || Number(process.env['MONGODB_POOL_SIZE']) || 10;
    this.CONNECT_TIMEOUT_MS = data?.CONNECT_TIMEOUT_MS || Number(process.env['MONGODB_CONNECT_TIMEOUT_MS']) || 30000;
    this.SOCKET_TIMEOUT_MS = data?.SOCKET_TIMEOUT_MS || Number(process.env['MONGODB_SOCKET_TIMEOUT_MS']) || 30000;
  }
}

export const MongoProvider = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get('MONGODB_URI'),
    dbName: configService.get('MONGODB_DB_NAME'),
    maxPoolSize: configService.get('MONGODB_POOL_SIZE'),
    connectTimeoutMS: configService.get('MONGODB_CONNECT_TIMEOUT_MS'),
    socketTimeoutMS: configService.get('MONGODB_SOCKET_TIMEOUT_MS'),
    onConnectionCreate: (connection: Connection) => {
      connection.on('connected', () => Logger.log('connected to MongoDB'));
      connection.on('open', () => Logger.log('MongoDB connection opened'));
      connection.on('disconnected', () => Logger.warn('disconnected from MongoDB'));
      connection.on('reconnected', () => Logger.log('reconnected to MongoDB'));
      connection.on('disconnecting', () => Logger.warn('MongoDB connection disconnecting'));

      return connection;
    },
  }),
});
