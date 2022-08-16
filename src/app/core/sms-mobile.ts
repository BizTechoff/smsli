import { Allow, Entity, Field, Fields, IdEntity, isBackend } from "remult";
import { Mobile } from "./mobile/mobile";
import { SendStatus } from "./sendStatus";
import { Sms } from "./sms/sms";

@Entity<SmsMobile>('smsMobile', (options, remult) => {
    options.caption = 'מסרים'
    options.allowApiCrud = Allow.authenticated
    options.saving = async (user) => {
        if (isBackend()) {
            if (user._.isNew()) {
                user.createDate = new Date();
            }
        }
    }
})
export class SmsMobile extends IdEntity {

    @Field(() => Sms)
    sms!: Sms

    @Field(() => Mobile)
    mobile!: Mobile

    @Field(() => SendStatus)
    status!: SendStatus

    @Fields.string({ caption: 'הערה לסטטוס' })
    sRemark = ''

    @Fields.date({
        allowApiUpdate: false
    })
    createDate = new Date();

}
