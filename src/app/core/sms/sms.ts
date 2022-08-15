import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity, isBackend, Validators } from "remult";
import { DEFUALT_DAY_WIDTH, DEFUALT_STRING_WIDTH, DEFUALT_TIME_WIDTH, terms } from "../../terms";
import { ByName } from "./byName";
import { SmsType } from "./smsType";

@Entity<Sms>('smsim', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
    options.saving = async (user) => {
        if (isBackend()) {
            if (user._.isNew()) {
                user.createDate = new Date();
            }
        }
    }
})
export class Sms extends IdEntity {

    @DataControl<Sms, SmsType>({ width: DEFUALT_STRING_WIDTH })
    @Field(() => SmsType)
    type = SmsType.flash
 
    @Fields.string({
        caption: 'תוכן הודעה',
        validate: [Validators.required.withMessage(terms.requiredField)]
    })
    text = ''

    @DataControl<Sms, ByName>({ width: DEFUALT_STRING_WIDTH })
    @Field(() => ByName)
    byName = ByName.fname

    @DataControl<Sms, Date>({ width: '149' })
    @Fields.dateOnly({ caption: 'תאריך' })
    date!: Date

    @DataControl<Sms, string>({ inputType: 'time', width: DEFUALT_TIME_WIDTH })
    @Fields.string({ caption: 'שעה' })
    time!: string

    @DataControl<Sms, boolean>({ width: DEFUALT_DAY_WIDTH })
    @Fields.boolean({ caption: 'א' })
    sunday = false

    @DataControl<Sms, boolean>({ width: DEFUALT_DAY_WIDTH })
    @Fields.boolean({ caption: 'ב' })
    monday = false

    @DataControl<Sms, boolean>({ width: DEFUALT_DAY_WIDTH })
    @Fields.boolean({ caption: 'ג' })
    tuesday = false

    @DataControl<Sms, boolean>({ width: DEFUALT_DAY_WIDTH })
    @Fields.boolean({ caption: 'ד' })
    wednesday = false

    @DataControl<Sms, boolean>({ width: DEFUALT_DAY_WIDTH })
    @Fields.boolean({ caption: 'ה' })
    thursday = false

    @DataControl<Sms, boolean>({ width: DEFUALT_DAY_WIDTH })
    @Fields.boolean({ caption: 'ו' })
    friday = false

    @DataControl<Sms, boolean>({ width: DEFUALT_DAY_WIDTH })
    @Fields.boolean({ caption: 'ז' })
    saturday = false

    @Fields.date({
        caption: 'נוצר ב',
        allowApiUpdate: false
    })
    createDate = new Date();


    isOneOdDayWeekSelected(): boolean {
        return this.sunday || this.monday || this.tuesday || this.wednesday || this.thursday || this.friday || this.saturday;
    }

    getDateDiff(fdate: Date, tdate: Date): number {
        if (fdate && tdate) {
            let diff = +tdate - +fdate;
            let days = (Math.ceil(diff / 1000 / 60 / 60 / 24) + 1);
            return days;
        }
        return 0;
    }
}
