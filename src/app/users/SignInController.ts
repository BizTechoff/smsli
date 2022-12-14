import jwt from 'jsonwebtoken';
import { BackendMethod, Controller, ControllerBase, Fields, UserInfo, Validators } from "remult";
import { terms } from "../terms";
import { Roles } from "./roles";
import { User } from "./user";

@Controller('signIn')
export class SignInController extends ControllerBase {

    @Fields.string({
        caption: terms.username,
        validate: Validators.required
    })
    user = '';

    @Fields.string({
        caption: terms.password,
        validate: Validators.required,
        inputType: 'password'
    })
    password = '';

    @Fields.boolean({
        caption: terms.rememberOnThisDevice,
    })
    rememberOnThisDevice = true;

    @BackendMethod({ allowed: true })
    async signIn() {
        let result: UserInfo;
        const userRepo = this.remult.repo(User);
        let u = await userRepo.findFirst({ name: this.user });
        if (!u) {
            if (await userRepo.count() === 0) { //first ever user is the admin
                u = await userRepo.insert({
                    name: this.user,
                    admin: true
                })
            }
        }
        if (u) {
            if (!u.password) { // if the user has no password defined, the first password they use is their password
                u.hashAndSetPassword(this.password);
                await u.save();
            }

            if (await u.passwordMatches(this.password)) {
                result = {
                    id: u.id,
                    roles: [],
                    name: u.name,
                    isAdmin: false
                };
                if (u.admin) {
                    result.roles.push(Roles.admin);
                    result.isAdmin = true
                }
            }
        }

        if (result!) {
            let token = (jwt.sign(result, getJwtSecret()));
            // throw 'Hi'
            u.loginDate = new Date()
            await u.save()
            return token
        }
        throw new Error(terms.invalidSignIn);
    }
}

export function getJwtSecret() {
    if (process.env['NODE_ENV'] === "production")
        return process.env['TOKEN_SIGN_KEY']!;
    return process.env['JWT_SECRET']!;
}
