import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {IdentityController} from './identity.controller';
import {IdentityService} from './identity.service';
import {SessionModel} from './models/Session.model';
import {SigninModel} from './models/Signin.model';
import {UserModel} from './models/User.model';

@Module({
    imports: [SequelizeModule.forFeature([UserModel, SessionModel, SigninModel])],
    controllers: [IdentityController],
    providers: [IdentityService]
})
export class IdentityModule {
}
