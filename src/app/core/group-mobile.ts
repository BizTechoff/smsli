import { Allow, Entity, Field, IdEntity } from "remult";
import { Group } from "./group/group";
import { Mobile } from "./mobile/mobile";

@Entity<GroupMobile>('groupMobiles', (options, remult) => {
    options.caption = 'קבוצה-סלולרי'
    options.allowApiCrud = Allow.authenticated
})
export class GroupMobile extends IdEntity {

    @Field(() => Group, {dbName: 'group_'})
    group!: Group

    @Field(() => Mobile)
    mobile!: Mobile
 
}
