import {Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import {UserModel} from './User.model';

@Table({tableName: 'sessions'})
export class SessionModel extends Model {

    @ForeignKey(() => UserModel)
    @Column
    user: number;

    @Column({type: DataType.STRING, allowNull: false})
    ip: string;

    @Column({type: DataType.STRING, allowNull: false, unique: true})
    token: string;
}
