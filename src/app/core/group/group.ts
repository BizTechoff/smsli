import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Fields, IdEntity } from "remult";
import { DEFUALT_STRING_WIDTH } from "../../terms";

@Entity('groups', (options, remult) => {
    options.caption = 'קבוצות'
    options.allowApiCrud = Allow.authenticated
})
export class Group extends IdEntity {

    @DataControl<Group, string>({ width: DEFUALT_STRING_WIDTH })
    @Fields.string({ caption: 'שם קבוצה' })
    name = ''

}
