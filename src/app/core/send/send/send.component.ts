import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { Allow, BackendMethod, Remult } from 'remult';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { NotificationService } from '../../../common/notificationService';
import { Mobile } from '../../mobile/mobile';
import { SendStatus } from '../../sendStatus';
import { SmsMobile } from '../../sms-mobile';
import { Sms } from '../../sms/sms';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  sms = this.remult.repo(Sms).create()
  mobiles = [] as Mobile[]

  constructor(private remult: Remult, private dialog: DialogService) { }

  async ngOnInit() {
    await this.refresh()
  }

  async refresh() {
    this.mobiles = await this.remult.repo(Mobile).find({
      where: { enabled: true }
    })
  }

  async addMobilesFromExcel() {

  }

  async addMobile() {
    let mobile = this.remult.repo(Mobile).create()
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: 'הוסף לקוח',
        fields: () => [
          mobile.$.number,
          mobile.$.fname,
          mobile.$.lname],
        ok: async () => {
          await mobile.save()
          await this.refresh()
        }
      })
  }

  @BackendMethod<SendComponent>({ allowed: Allow.authenticated })
  async sendSmsMobiles(smsMobileId = '', remult?: Remult) {
    for await (const s of remult!.repo(SmsMobile).query({
      where: { id: smsMobileId /*, mobile: {enabled: true }*/ }
    })) {
      if (s.mobile.enabled) {
        if (s.status !== SendStatus.sent) {
          let text = s.sms.text
          if (text.includes('!name!')) {
            text = text.replace(
              '!name!',
              this.sms.byName.isFname()
                ? s.mobile.fname
                : this.sms.byName.isLname()
                  ? s.mobile.lname
                  : s.mobile.fname + ' ' + s.mobile.lname)
          }
          let sent = await NotificationService.SendSms({
            messageType: s.sms.type.id,
            message: text,
            mobile: s.mobile.number,
            uid: remult!.user.id//,
            // schedule
          })
          if (sent) {
            if (sent.success) {
              s.status = SendStatus.sent
              await s.save()
            }
            else {
              console.error('Error sending: ' + sent.message)
            }
          }
          else {
            console.error('UnKnown ERROR')
          }
        }
      }
    }
  }

  async send() {
    console.log(0)
    await this.sms.save()
    console.log(1)
    for (const m of this.mobiles) {
      if (m.enabled) {
        let sm = this.remult.repo(SmsMobile).create()
        sm.sms = this.sms
        sm.mobile = m
        sm.status = SendStatus.sending
        await sm.save()
        console.log(2)
        let msg = this.sms.text
        if (msg.includes('!name!')) {
          msg = msg.replace(
            '!name!',
            this.sms.byName.isFname()
              ? m.fname
              : this.sms.byName.isLname()
                ? m.lname
                : m.fname + ' ' + m.lname)
        }
        let sent = await NotificationService.SendSms({
          messageType: this.sms.type.id,
          message: msg,
          mobile: m.number,
          uid: this.remult.user.id//,
          // schedule
        })
        console.log(3, JSON.stringify(sent))

        if (sent && sent.success) {
          sm.status = SendStatus.sent
          await sm.save()
          this.dialog.info('נשלח בהצלחה');
        }
        else {
          sm.status = SendStatus.error
          sm.sRemark = sent?.message
          await sm.save()
          this.dialog.info('שליחה נכשלה');
        }
      }
    }
  }


}
