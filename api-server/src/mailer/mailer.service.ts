import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport(this.configService.get('mailer'));
    }

    /**
     * Sends an email using the specified details.
     *
     * @param {string} to - The email address of the recipient.
     * @param {string} subject - The subject of the email.
     * @param {string} template - The template content of the email.
     * @param {Record<string, any>} variables - The variables to be replaced in the email template.
     * @return {Promise<any>} - A promise that resolves when the email is sent successfully.
     */
    sendMail(to: string, subject: string, template: string, variables: Record<string, any>): Promise<any> {
        let result = template;
        for (const name in variables)
            result = result.replaceAll('%%' + name + '%%', String(variables[name]));

        return this.transporter.sendMail({
            to,
            subject,
            from: this.configService.get<string>('mailer.auth.user'),
            text: result
        });
    }
}
