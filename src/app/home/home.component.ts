import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { DialogService } from '../common/dialog';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { NotificationService } from '../common/notificationService';
import { Mobile } from '../core/mobile/mobile';
import { SendStatus } from '../core/sendStatus';
import { SmsMobile } from '../core/sms-mobile';
import { Sms } from '../core/sms/sms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sms = this.remult.repo(Sms).create()
  mobiles = [] as Mobile[]

  constructor(private remult: Remult, private dialog: DialogService) { }

  async ngOnInit() {
    await this.refresh()
  }

  async refresh() {
    this.mobiles = await this.remult.repo(Mobile).find()
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

  async send() {
    console.log(0)
    await this.sms.save()
    console.log(1)
    for (const m of this.mobiles) {
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
        await sm.save()
        this.dialog.info('שליחה נכשלה');
      }
    }
  }


}
