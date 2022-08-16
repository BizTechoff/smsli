import { Allow, Entity, Fields, IdEntity, isBackend } from "remult";
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
                        name: 'כללי', system: true
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

    @Fields.string((options, remult) => {
        options.caption = 'סלולרי'
    })
    number = ''

    @Fields.string((options, remult) => {
        options.caption = 'שם פרטי'
    })
    fname = ''

    @Fields.string((options, remult) => {
        options.caption = 'שם משפחה'
    })
    lname = ''

    @Fields.string((options, remult) => {
        options.caption = 'הערה'
    })
    remark = ''

    @Fields.boolean((options, remult) => {
        options.caption = 'פעיל'
    })
    enabled = true

}
