import { Allow, Entity, Fields, IdEntity } from "remult";

@Entity('mobiles', (options, remult) => {
    options.caption = 'סלולרים'
    options.allowApiCrud = Allow.authenticated
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

}
