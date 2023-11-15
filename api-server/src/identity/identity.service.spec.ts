import {SequelizeModule} from '@nestjs/sequelize';
import {Test, TestingModule} from '@nestjs/testing';
import {CreateUserDto} from './dto/CreateUser.dto';
import {IdentityService} from './identity.service';
import {SessionModel} from './models/Session.model';
import {UserModel} from './models/User.model';

/**
 * Generates a random string consisting of characters from the alphabet.
 *
 * @param {number} length - The length of the random string to generate.
 * @returns {string} - The randomly generated string.
 */
const randomChars = (length: number): string => 'x'.repeat(length)
    .replaceAll(/x/g, () =>
        'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
            .charAt(Math.floor(Math.random() * (26 * 2)))
    );

describe('IdentityService', () => {
    let service: IdentityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                SequelizeModule.forRoot({
                    dialect: 'postgres',
                    models: [UserModel, SessionModel],
                    host: 'localhost',
                    port: 5432,
                    username: 'postgres',
                    password: 'root',
                    database: 'kcall_test',
                    autoLoadModels: true
                }),
                SequelizeModule.forFeature([UserModel, SessionModel])
            ],
            providers: [IdentityService],
        }).compile();

        service = module.get<IdentityService>(IdentityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should method `getUsers` return the array', async () => {
        expect(await service.getUsers()).toBeInstanceOf(Array);
    });

    it('should method `createUsers` create the user', async () => {
        const form: CreateUserDto = {
            email: randomChars(32) + '@example.com',
            firstName: randomChars(32),
            lastName: randomChars(32),
            nickname: randomChars(32)
        };

        const result = await service.createUser(form);

        expect(result).toEqual(expect.objectContaining(form));
    });

    it('should method `getUserById` find created user', async () => {
        const form: CreateUserDto = {
            email: randomChars(8) + '@example.com',
            firstName: randomChars(8),
            lastName: randomChars(8),
            nickname: randomChars(8)
        };

        const result = await service.createUser(form);

        expect(await service.getUserById(result.id)).toEqual(expect.objectContaining(form));
    });

    it('should method `getUserById` doesn\'t find non existent user', async () => {
        expect(await service.getUserById(0)).toBe(null);
    });

    it('should method `updateUser` will update user data', async () => {
        const form: CreateUserDto = {
            email: randomChars(8) + '@example.com',
            firstName: randomChars(8),
            lastName: randomChars(8),
            nickname: randomChars(8)
        };

        const user = await service.createUser(form);

        const updateData: Partial<CreateUserDto> = {firstName: 'Tyler'};
        const [count, rows] = await service.updateUser(user.id, updateData);

        expect(count).toBe(1);
        expect(rows[0]).toEqual(expect.objectContaining(updateData));
    });

    it('should method `updateUser` will not update user data for non existent id', async () => {
        const updateData: Partial<CreateUserDto> = {firstName: 'Tyler'};
        const [count, rows] = await service.updateUser(0, updateData);

        expect(count).toBe(0);
    });

    it('should method `deleteUser` will delete the user', async () => {
        const form: CreateUserDto = {
            email: randomChars(8) + '@example.com',
            firstName: randomChars(8),
            lastName: randomChars(8),
            nickname: randomChars(8)
        };

        const user = await service.createUser(form);

        expect(await service.deleteUser(user.id)).toBe(1);
    });

    it('should method `getUserByEmail` will find user by email', async () => {
        const email = randomChars(8) + '@' + randomChars(4) + '.com';
        const form: CreateUserDto = {
            email,
            firstName: randomChars(8),
            lastName: randomChars(8),
            nickname: randomChars(8)
        };

        const user = await service.createUser(form);
        expect(await service.getUserByEmail(email)).toEqual(expect.objectContaining(form));
    });
});
