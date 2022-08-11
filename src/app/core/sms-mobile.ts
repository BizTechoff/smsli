import { Allow, Entity, Field, IdEntity } from "remult";
import { Mobile } from "./mobile/mobile";
import { SendStatus } from "./sendStatus";
import { Sms } from "./sms/sms";

@Entity('messages', (options, remult) => {
    options.caption = 'מסרים'
    options.allowApiCrud = Allow.authenticated
})
export class SmsMobile extends IdEntity {

    @Field(() => Sms)
    sms!: Sms

    @Field(() => Mobile)
    mobile!: Mobile

    @Field(() => SendStatus)
    status!: SendStatus

}
