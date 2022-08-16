import { Component, OnInit } from '@angular/core';
import { Fields, getFields, Remult } from 'remult';

import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Roles } from '../../../users/roles';
import { Mobile } from '../../mobile/mobile';
import { MobilesComponent } from '../../mobile/mobiles/mobiles.component';
import { SmsMobile } from '../../sms-mobile';
import { Sms } from '../sms';
import { SmsTextBuilderComponent } from '../sms-text-builder/sms-text-builder.component';
import { SmsType } from '../smsType';


@Component({
  selector: 'app-smsim',
  templateUrl: './smsim.component.html',
  styleUrls: ['./smsim.component.scss']
})
export class SmsimComponent implements OnInit {

  args: {
    title?: string,
    selected?: string[],
    multi?: boolean,
    changed?: boolean,
    mid?: string
  } = { title: '', selected: [] as string[], multi: false, changed: false, mid: '' }
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<SmsimComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש תוכן הודעה' })
  search = ''

  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  smsim = new GridSettings(this.remult.repo(Sms), {
    // allowDelete: true,
    // allowInsert: true,
    // allowUpdate: true,
    allowCrud: false,
    numOfColumnsInGrid: 15,
    orderBy: { createDate: "desc" },
    rowsInPage: 25,
    columnSettings: row => [
      row.byName,
      row.text,
      row.date,
      row.time,
      row.sunday,
      row.monday,
      row.tuesday,
      row.wednesday,
      row.thursday,
      row.friday,
      row.saturday,
      row.createDate//,
      // { field: row.sunday, caption: '1', width: '10', readOnly: true },
      // { field: row.monday, caption: '2', width: '10', readOnly: true },
      // { field: row.tuesday, caption: '3', width: '10', readOnly: true },
      // { field: row.wednesday, caption: '4', width: '10', readOnly: true },
      // { field: row.thursday, caption: '5', width: '10', readOnly: true },
      // { field: row.friday, caption: '6', width: '10', readOnly: true },
      // { field: row.saturday, caption: '7', width: '10', readOnly: true },
    ],
    gridButtons: [
      {
        name: 'רענן',
        icon: 'refresh',
        click: async () => await this.refresh()
      }
    ],
    rowButtons: [
      {
        name: terms.mobiles,
        click: async row => {
          await this.assignMobiles(row.id, row.type)
        }
      }
    ],
    // confirmDelete: async (h) => {
    //   return await this.dialog.confirmDelete(h.name)
    // },
  });

  loaded = false
  async ngOnInit() {
    // console.log('this.smsim.items.length',this.smsim.items.length)
    await this.smsim.reloadData()
    // console.log('this.smsim.items.length',this.smsim.items.length)
    if (this.smsim.items.length === 0) {
      // await this.upsertUser()
    }
    this.loaded = true
  }

  async refresh() {
    // console.log('this.smsim.items.length',this.smsim.items.length)
    await this.smsim.reloadData()
    // console.log('this.smsim.items.length',this.smsim.items.length)
  }

  async smsTextBuilder() {
    await openDialog(SmsTextBuilderComponent)
  }

  async save() {
    if (this.args.mid?.trim().length) {
      for (const gid of this.args.selected!) {
        let gm = this.remult.repo(SmsMobile).create()
        gm.sms = await this.remult.repo(Sms).findId(gid)
        gm.mobile = await this.remult.repo(Mobile).findId(this.args.mid!)
        await gm.save()
      }
      // this.win?.close()
    }
  }

  async upsertUser(id = '') {
    let u: Sms
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון הודעה'
      u = await this.remult.repo(Sms).findId(id, { useCache: false })
      if (!u) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת הודעה'
      u = this.remult.repo(Sms).create()
      // u.avrech = true
    }

    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [
          [
            u.$.byName,
            u.$.type
          ],
          [
            u.$.date,
            u.$.time
          ],
          {
            field: u.$.text,
            click: async (row, col) => {
              await this.smsTextBuilder()//col.text
            }
          },
          [
            u.$.sunday,
            u.$.monday,
            u.$.tuesday
          ],
          [
            u.$.wednesday,
            u.$.thursday,
            u.$.friday
          ]//,
          // u.$.saturday]
          // u.$.address,
          // u.$.missionLocation,
          // u.$.missionDate,
        ],
        ok: async () => {
          await u.save()
        }
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      // await u.save()
      await this.refresh()
    }
  }

  async assignMobiles(sid: string, type: SmsType) {
    if (!sid?.trim().length ?? false) {
      throw 'assignMobiles got group-id NOT VALID'
    }
    // let title = 'שיוך סלולרי לקבוצות'
    let title = `שיוך ${'הודעה'} לסלולרים`
    let changed2 = await openDialog(MobilesComponent,
      win => win.args = { title: title, sid: sid, multi: true },
      win => win?.args.changed)
    if (changed2) {
      await this.refresh()
    }
  }

  async close() {

  }

}
