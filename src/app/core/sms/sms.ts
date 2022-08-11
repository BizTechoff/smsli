import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { ByName } from "./byName";

@Entity('smsim', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class Sms extends IdEntity {

    @Fields.dateOnly({ caption: 'תאריך' })
    date!: Date

    @DataControl<Sms, string>({ inputType: 'time' })
    @Fields.string({ caption: 'שעה' })
    time!: string

    @Field(() => ByName)
    byName = ByName.fname

    @Fields.string({ caption: '' })
    text = ''

}
