import {ApiProperty} from '@nestjs/swagger';

export class ErrorBodyDto {

    @ApiProperty({description: 'Error message as translation key'})
    message: string;
}
