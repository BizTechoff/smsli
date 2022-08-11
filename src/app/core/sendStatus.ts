import { ValueListFieldType } from "remult"

@ValueListFieldType<SendStatus>({ caption: 'סטטוס שליחה' })
export class SendStatus {
    static new = new SendStatus()
    static sending = new SendStatus()
    static sent = new SendStatus()
    static error = new SendStatus()
    id!: string
}
