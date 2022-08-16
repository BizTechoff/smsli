import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Fields, IdEntity, isBackend } from "remult";
import { DEFUALT_BOOL_WIDTH, DEFUALT_MOBILE_WIDTH, DEFUALT_STRING_WIDTH } from "../../terms";
import { GroupMobile } from "../group-mobile";
import { Group } from "../group/group";

@Entity<Mobile>('mobiles', (options, remult) => {
    options.caption = 'סלולרים'
    options.allowApiCrud = Allow.authenticated
    options.saving = async row => {
        if (isBackend()) {
            if (row.isNew()) {
                let gm = await remult.repo(GroupMobile).findFirst(
                    { mobile: row },
                    { createIfNotFound: true })
                if (!gm.group) {
                    gm.group = await remult.repo(Group).findFirst({
                        name: 'כל אנשי הקשר', system: true
                    })
                    if (!gm.group) {
                        throw 'Group General(system) NOT FOUND'
                    }
                    await gm.save()
                }
            }
        }
    }
})
export class Mobile extends IdEntity {

    @DataControl<Mobile, string>({ width: DEFUALT_MOBILE_WIDTH })
    @Fields.string((options, remult) => {
        options.caption = 'סלולרי'
    })
    number = ''

    @DataControl<Mobile, string>({ width: DEFUALT_STRING_WIDTH })
    @Fields.string((options, remult) => {
        options.caption = 'שם פרטי'
    })
    fname = ''

    @DataControl<Mobile, string>({ width: DEFUALT_STRING_WIDTH })
    @Fields.string((options, remult) => {
        options.caption = 'שם משפחה'
    })
    lname = ''

    @Fields.string((options, remult) => {
        options.caption = 'הערה'
    })
    remark = ''

    @DataControl<Mobile, string>({ width: DEFUALT_BOOL_WIDTH })
    @Fields.boolean((options, remult) => {
        options.caption = 'פעיל'
    })
    enabled = true

    fullName() {
        return `${this.fname ?? ''} ${this.lname ?? ''}`.trim()
    }

}
