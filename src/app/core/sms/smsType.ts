import { ValueListFieldType } from "remult"

@ValueListFieldType<SmsType>({ caption: 'סוג שליחה' })
export class SmsType {
    static sms = new SmsType('מסרון')
    static tts = new SmsType('מולטימדיה')
    static flash = new SmsType('פלאש')
    constructor(public caption = '') { }
    id!: string
    isSms() { return this === SmsType.sms }
    isTts() { return this === SmsType.tts }
    isFlash() { return this === SmsType.flash }
}
