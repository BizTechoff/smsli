import { createPostgresConnection } from 'remult/postgres';
import { remultExpress } from 'remult/remult-express';
import { Mobile } from '../app/core/mobile/mobile';
import { SmsMobile } from '../app/core/sms-mobile';
import { Sms } from '../app/core/sms/sms';
import { SignInController } from '../app/users/SignInController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { User } from '../app/users/user';

export const api = remultExpress({
    entities: [User, Mobile, Sms, SmsMobile],
    controllers: [SignInController, UpdatePasswordController],
    dataProvider: async () => {
        // if (process.env['NODE_ENV'] === "production")
        return createPostgresConnection({ configuration: "heroku" })
        // return undefined;
    }
});