import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import {session} from "telegraf";
import {TelegrafModule} from "nestjs-telegraf";
import * as LocalSession from 'telegraf-session-local'
import {TypeOrmModule} from "@nestjs/typeorm";
import {TaskEntity} from "./db/entities/task.entity";
import {ConfigModule, ConfigService} from "@nestjs/config";

const sessions = new LocalSession({database: 'session_db.json'})

@Module({
  imports: [
      ConfigModule.forRoot(),
      TelegrafModule.forRoot({
          middlewares: [sessions.middleware()],
          token: process.env.TELEGRAM_TOKEN
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: +configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: ['./dist/db/entities/*.{ts,js}'],
                synchronize: true,
            }),
          inject: [ConfigService]
      }),
      TypeOrmModule.forFeature([
          TaskEntity
      ])
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
