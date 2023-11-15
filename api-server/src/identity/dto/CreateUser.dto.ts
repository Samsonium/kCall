import {ApiProperty} from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({description: 'UserModel\'s first name', example: 'Tyler'})
    firstName: string;

    @ApiProperty({description: 'UserModel\'s last name', example: 'Lowell'})
    lastName: string;

    @ApiProperty({description: 'System nickname', example: 'samsonium'})
    nickname: string;

    @ApiProperty({description: 'Unique email', example: 'simple@example.com'})
    email: string;
}
