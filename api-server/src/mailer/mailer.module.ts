import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MailerService} from './mailer.service';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [],
    providers: [MailerService, ConfigService]
})
export class MailerModule {
}

