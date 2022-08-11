import { ValueListFieldType } from "remult"

@ValueListFieldType<ByName>({ caption: 'שליחה לפי' })
export class ByName {
    static fname = new ByName('שם פרטי')
    static lname = new ByName('שם משפחה')
    static both = new ByName('שניהם')
    constructor(public caption = '') { }
    id!: string
    isFname() { return this === ByName.fname }
    isLname() { return this === ByName.lname }
    isBoth() { return this === ByName.both }
}
