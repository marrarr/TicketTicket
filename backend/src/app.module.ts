import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RezerwacjaModule } from './rezerwacja/rezerwacja.module';
import { RolaModule } from './rola/rola.module';
import { UzytkownikModule } from './uzytkownik/uzytkownik.module';
import { UzytkownikService } from './uzytkownik/uzytkownik.service';
import { AppDataSource } from './data-source';
import { AuthModule } from './auth/auth.module';
import { Uzytkownik } from './uzytkownik/uzytkownik.entity';
import { MulterModule } from '@nestjs/platform-express';
import { SiedzenieModule } from './siedzenie/siedzenie.module';
import { Sala } from './sala/sala.entity';
import { SalaModule } from './sala/sala.module';
import { SeansModule } from './seans/seans.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from './mongo/log.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    LogModule,
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),
    RezerwacjaModule,
    SiedzenieModule,
    SalaModule,
    SeansModule,
    UzytkownikModule,
    RolaModule,
    AuthModule,
    MulterModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
