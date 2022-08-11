import { BackendMethod } from "remult";
import { SmsRequest } from "../../server/send-sms";

export class NotificationService {

    static sendSms: (req: SmsRequest) => Promise<{ success: boolean, message: string, count: number }>;

    @BackendMethod({ allowed: true })
    static async SendSms(req: SmsRequest) {
        return await NotificationService.sendSms(req);
    }

}
