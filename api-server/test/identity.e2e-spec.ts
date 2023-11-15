import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {IdentityModule} from '../src/identity/identity.module';

describe('IdentityController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [IdentityModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });
});
