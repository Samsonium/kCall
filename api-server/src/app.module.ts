import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {SequelizeModule} from '@nestjs/sequelize';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import configLoader from './config.loader';
import {IdentityModule} from './identity/identity.module';
import {SessionModel} from './identity/models/Session.model';
import {SigninModel} from './identity/models/Signin.model';
import {UserModel} from './identity/models/User.model';
import {MailerModule} from './mailer/mailer.module';
import {MailerService} from './mailer/mailer.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configLoader],
            isGlobal: true
        }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.get<string>('db.host'),
                port: configService.get<number>('db.port'),
                username: configService.get<string>('db.username'),
                password: configService.get<string>('db.password'),
                database: configService.get<string>('db.database'),
                models: [UserModel, SessionModel, SigninModel],
                autoLoadModels: true
            })
        }),
        IdentityModule,
        MailerModule
    ],
    controllers: [AppController],
    providers: [AppService, MailerService],
})
export class AppModule {
}
