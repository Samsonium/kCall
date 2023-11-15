import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {CreateUserDto} from './dto/CreateUser.dto';
import {SessionModel} from './models/Session.model';
import {UserModel} from './models/User.model';

@Injectable()
export class IdentityService {

    constructor(
        @InjectModel(UserModel) private userRepo: typeof UserModel,
        @InjectModel(SessionModel) private sessionRepo: typeof SessionModel
    ) {
    }

    /**
     * Retrieves a list of users from the database.
     *
     * @return {Promise<UserModel[]>} - A promise that resolves to an array of UserModel objects representing the users.
     */
    getUsers(): Promise<UserModel[]> {
        return this.userRepo.findAll();
    }

    /**
     * Retrieves a user from the database based on the provided ID.
     *
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<UserModel | null>} - A promise that resolves to the user model if found,
     *                                        or null if no user with the provided ID exists.
     */
    getUserById(id: number): Promise<UserModel | null> {
        return this.userRepo.findOne({where: {id}});
    }

    /**
     * Retrieves a user by email.
     *
     * @param {string} email - The email of the user to retrieve.
     * @returns {Promise<UserModel|null>} - A Promise that resolves to the user object if found, otherwise null.
     */
    getUserByEmail(email: string): Promise<UserModel | null> {
        return this.userRepo.findOne({where: {email}});
    }

    /**
     * Creates a new user.
     *
     * @param {CreateUserDto} dto - The data transfer object containing user information.
     * @return {Promise<UserModel>} - A promise that resolves to the newly created user model.
     */
    createUser(dto: CreateUserDto): Promise<UserModel> {
        return this.userRepo.create(dto as Partial<UserModel>);
    }

    /**
     * Updates a user in the database.
     *
     * @param {number} id - The ID of the user to be updated.
     * @param {Partial<CreateUserDto>} data - The updated user data.
     * @return {Promise<[number, UserModel[]]>} - A promise that resolves with an array containing the affected count
     *                                            and the updated user model.
     */
    updateUser(id: number, data: Partial<CreateUserDto>): Promise<[affectedCount: number, affectedRows: UserModel[]]> {
        return this.userRepo.update(data, {where: {id}, returning: true});
    }

    /**
     * Deletes a user from the database based on the provided id.
     *
     * @param {number} id - The id of the user to be deleted.
     * @return {Promise<number>} - A promise that resolves to the number of deleted rows in the database.
     */
    deleteUser(id: number): Promise<number> {
        return this.userRepo.destroy({where: {id}});
    }
}
