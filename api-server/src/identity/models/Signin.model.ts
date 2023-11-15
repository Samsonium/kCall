import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({tableName: 'sign_in', updatedAt: false})
export class SigninModel extends Model {

    @Column({type: DataType.STRING, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    code: string;
}
