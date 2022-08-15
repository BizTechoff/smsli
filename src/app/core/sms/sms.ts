import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { DEFUALT_Date_WIDTH, DEFUALT_TIME_WIDTH } from "../../terms";
import { ByName } from "./byName";

@Entity('smsim', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class Sms extends IdEntity {

    @Fields.string({ caption: '' })
    text = '' 

    @Field(() => ByName)
    byName = ByName.fname

    @DataControl<Sms, string>({ width: DEFUALT_Date_WIDTH })
    @Fields.dateOnly({ caption: 'תאריך' })
    date!: Date

    @DataControl<Sms, string>({ inputType: 'time', width: DEFUALT_TIME_WIDTH })
    @Fields.string({ caption: 'שעה' })
    time!: string
    
    @Fields.boolean({ caption: 'א' })
    sunday = false
    
    @Fields.boolean({ caption: 'ב' })
    monday = false
    
    @Fields.boolean({ caption: 'ג' })
    tuesday = false
    
    @Fields.boolean({ caption: 'ד' })
    wednesday = false
    
    @Fields.boolean({ caption: 'ה' })
    thursday = false
    
    @Fields.boolean({ caption: 'ו' })
    friday = false
    
    @Fields.boolean({ caption: 'ז' })
    saturday = false
    
}
