import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RezerwacjaModule } from './rezerwacja/rezerwacja.module';
import { RolaModule } from './rola/rola.module';
import { UzytkownikModule } from './uzytkownik/uzytkownik.module';
import { AppDataSource } from './data-source';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { SiedzenieModule } from './siedzenie/siedzenie.module';
import { SalaModule } from './sala/sala.module';
import { SeansModule } from './seans/seans.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from './mongo/log.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: '.env',
    }),
    
    // --- POPRAWIONA KONFIGURACJA ---
    ServeStaticModule.forRoot({
      // process.cwd() wskazuje na folder, w którym uruchamiasz 'npm start' (główny katalog backendu)
      rootPath: join(process.cwd(), 'uploads'), 
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false, // Ważne: Nie szukaj pliku index.html, jeśli nie znaleziono obrazka
      },
    }),
    // -------------------------------

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