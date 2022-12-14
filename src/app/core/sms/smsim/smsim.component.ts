import { Component, OnInit } from '@angular/core';
import { FieldRef, Fields, getFields, Remult } from 'remult';

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
    allowSelection: this.args.multi,
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
    if (!this.args) {
      this.args = { title: '', selected: [] as string[], multi: false, changed: false, mid: '' }
    }
    this.args.selected = this.args.selected ?? [] as string[]
    this.args.multi = this.args.multi ?? false
    this.args.changed = this.args.changed ?? false
    this.args.mid = this.args.mid ?? ''
    this.args.title = this.args.title ?? ''
    console.log(22, 'SmsimComponent.args', this.args)

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

  async smsTextBuilder(col: FieldRef<Sms, string>): Promise<string> {
    let output = await openDialog<string, SmsTextBuilderComponent>(SmsTextBuilderComponent,
      win => win.args = { input: col.value },
      win => win?.args?.output ?? '')
    // if (win?.args?.saved)
    col.value = output
    return output
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
    let s: Sms
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון הודעה'
      s = await this.remult.repo(Sms).findId(id, { useCache: false })
      if (!s) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת הודעה'
      s = this.remult.repo(Sms).create()
      // u.avrech = true
    }

    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [
          [
            { field: s.$.byName, width: '100%' },
            { field: s.$.type, width: '100%' }
          ],
          [
            { field: s.$.date, width: '100%' },
            { field: s.$.time, width: '100%' }
          ],
          {
            field: s.$.text,
            click: async (row, col) => {
              await this.smsTextBuilder(s.$.text)//col.text
            }
          },
          [
            s.$.sunday,
            s.$.monday,
            s.$.tuesday
          ],
          [
            s.$.wednesday,
            s.$.thursday,
            s.$.friday
          ]//,
          // u.$.saturday]
          // u.$.address,
          // u.$.missionLocation,
          // u.$.missionDate,
        ],
        ok: async () => {
          await s.save()
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
