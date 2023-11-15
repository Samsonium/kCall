import {ApiProperty} from '@nestjs/swagger';
import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({tableName: 'users'})
export class UserModel extends Model {

    @ApiProperty({description: 'Displayed first name'})
    @Column({type: DataType.STRING})
    firstName: string;

    @ApiProperty({description: 'Displayed last name'})
    @Column({type: DataType.STRING})
    lastName: string;

    @ApiProperty({description: 'Unique nickname'})
    @Column({type: DataType.STRING, allowNull: false})
    nickname: string;

    @ApiProperty({description: 'Unique email'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;
}
