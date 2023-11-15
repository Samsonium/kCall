import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {IdentityModule} from './identity/identity.module';
import {SequelizeModule} from '@nestjs/sequelize';
import {UserModel} from './identity/models/User.model';
import {SessionModel} from './identity/models/Session.model';
import {SigninModel} from './identity/models/Signin.model';

@Module({
    imports: [SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'kcall',
        models: [UserModel, SessionModel, SigninModel],
        // retryAttempts: 3,
        // autoLoadModels: true
    }), IdentityModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
