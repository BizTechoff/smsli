import { Allow, Entity, Field, Fields, IdEntity, isBackend } from "remult";
import { Group } from "./group/group";
import { Mobile } from "./mobile/mobile";

@Entity<GroupMobile>('groupMobile', (options, remult) => {
    options.caption = 'קבוצה-סלולרי'
    options.allowApiCrud = Allow.authenticated
    options.saving = async (user) => {
        if (isBackend()) {
            if (user._.isNew()) {
                user.createDate = new Date();
            }
        }
    }
})
export class GroupMobile extends IdEntity {

    @Field(() => Group, { dbName: 'group_' })
    group!: Group

    @Field(() => Mobile)
    mobile!: Mobile

    @Fields.date({
        allowApiUpdate: false
    })
    createDate = new Date();

}
