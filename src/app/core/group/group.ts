import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Fields, IdEntity, Validators } from "remult";
import { DEFUALT_STRING_WIDTH, terms } from "../../terms";

@Entity<Group>('groups', (options, remult) => {
    options.caption = 'קבוצות'
    options.allowApiCrud = Allow.authenticated
})
export class Group extends IdEntity {

    @DataControl<Group, string>({ width: DEFUALT_STRING_WIDTH })
    @Fields.string({
        caption: 'שם קבוצה', validate:
            [
                Validators.required.withMessage(terms.requiredField),
                Validators.unique.withMessage(terms.uniqueField)
            ]
    })
    name = ''

    @Fields.boolean({
        includeInApi: false,
        caption: 'בשימוש המערכת',
        // dbName: 'system_'
    })
    system = false

    // static async getGeneral(): Promise<Group> {
    //     let result! = await rem

    //     return result
    // }

}
