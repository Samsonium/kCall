import {Module} from '@nestjs/common';
import {IdentityController} from './identity.controller';
import {IdentityService} from './identity.service';
import {SequelizeModule} from '@nestjs/sequelize';
import {SessionModel} from './models/Session.model';
import {UserModel} from './models/User.model';
import {SigninModel} from './models/Signin.model';

@Module({
    imports: [SequelizeModule.forFeature([UserModel, SessionModel, SigninModel])],
    controllers: [IdentityController],
    providers: [IdentityService]
})
export class IdentityModule {
}
