import compression from 'compression';
import { config } from 'dotenv';
import express from 'express';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import sslRedirect from 'heroku-ssl-redirect';
import swaggerUi from 'swagger-ui-express';
import { getJwtSecret } from '../app/users/SignInController';
import { api } from './api';
import './send-sms';

config(); //loads the configuration from the .env file

async function startup() {
    const app = express();
    app.use(sslRedirect());
    app.use(expressjwt({ secret: getJwtSecret(), credentialsRequired: false, algorithms: ['HS256'] }));
    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );

    app.use(api);
    app.use('/api/docs', swaggerUi.serve,
        swaggerUi.setup(api.openApiDoc({ title: 'smsli-todo' })));



    // async function register(action: string, path: string, doWork: (req: express.Request, context: Context) => Promise<string>) {
    //     let f = async (req, res) => {
    //         let apiKey = req.query.key as string;
    //         if (apiKey === process.env.APIKEY) {
    //             let context = await expressBridge.getValidContext(req);
    //             // context.clearAllCache();
    //             if (!apiUser) {
    //                 apiUser = await context.for(Users).findOrCreate({ where: row => row.name.isEqualTo('api') });
    //                 if (apiUser.isNew()) {
    //                     apiUser.admin.value = true;
    //                     await apiUser.save();
    //                 }
    //             }
    //             // console.log('apiUser.admin.value',apiUser.admin.value);

    //             if (!apiUser.admin.value!) {
    //                 res.send('User API disabled.');
    //             }
    //             else {
    //                 context.setUser({ id: apiUser.id.value, name: apiUser.name.value, roles: [] });
    //                 let result = await doWork(req, context);
    //                 res.send(result);
    //             }
    //         }
    //         else {
    //             res.send("NOT ALLOWED");
    //         };
    //     };

    //     if (action === 'post') {
    //         app.post('/api-req/' + path, f);
    //     }
    //     else {
    //         app.get('/api-req/' + path, f);
    //     }
    // }

    // register('post', "mobile-ok", async (req, context) => {
    //     return new Date().toLocaleString('he-IL');
    // });

    // register('post', "mobiles", async (req, context) => {
    //     return await Mobile.post({
    //         id: req.query.id as string,
    //         name: req.query.name as string,
    //         uid: req.query.userid as string
    //     }, context);
    // });




    app.use('/api/:mid/ok/:sid', async (req, res) => {
        try {
            // let m = await remult.repo(Mobile).findId(mid)
            // let s = await remult.repo(Sms).findId(sid)
            // let sm = await remult.repo(SmsMobile).findFirst(mobile, sms)
            // sm.replyOk = true
            // await sm.save()
            res.sendFile(process.cwd() + '/dist/smsli/index.html');
        } catch (err) {
            res.sendStatus(500);
        }
    });

    app.use(express.static('dist/smsli'));
    app.use('/*', async (req, res) => {
        try {
            res.sendFile(process.cwd() + '/dist/smsli/index.html');
        } catch (err) {
            res.sendStatus(500);
        }
    });
    let port = process.env['PORT'] || 3002;
    app.listen(port);
}

startup();
