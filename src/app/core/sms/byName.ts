import { ValueListFieldType } from "remult"

@ValueListFieldType<ByName>({ caption: 'סוג שם' })
export class ByName {
    static fname = new ByName()
    static lname = new ByName()
    static both = new ByName()
    id!: string
}
