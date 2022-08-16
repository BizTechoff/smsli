import { Component, OnInit } from '@angular/core';
import { Fields, getFields, Remult } from 'remult';

import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Roles } from '../../../users/roles';
import { GroupMobile } from '../../group-mobile';
import { Group } from '../../group/group';
import { GroupsComponent } from '../../group/groups/groups.component';
import { SmsMobile } from '../../sms-mobile';
import { Sms } from '../../sms/sms';
import { SmsimComponent } from '../../sms/smsim/smsim.component';
import { Mobile } from '../mobile';


@Component({
  selector: 'app-mobiles',
  templateUrl: './mobiles.component.html',
  styleUrls: ['./mobiles.component.scss']
})
export class MobilesComponent implements OnInit {

  args: {
    title?: string,
    selected?: string[],
    multi?: boolean,
    changed?: boolean,
    gid?: string,//group
    sid?: string//sms
  } = { title: '', selected: [] as string[], multi: false, changed: false, gid: '', sid: '' }

  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<MobilesComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש סלולרי' })
  search = ''

  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  mobiles!: GridSettings<Mobile>

  async ngOnInit() {
    if (!this.args) {
      this.args = { title: '', selected: [] as string[], multi: false, changed: false, gid: '', sid: '' }
    }
    console.log(11, 'this.args', this.args)
    this.args.selected = this.args.selected ?? [] as string[]
    this.args.multi = this.args.multi ?? false
    this.args.changed = this.args.changed ?? false
    this.args.gid = this.args.gid ?? ''
    this.args.sid = this.args.sid ?? ''
    this.args.title = this.args.title ?? ''

    console.log(22, 'this.args', this.args)
    this.intiGrid()
    console.log(33)

    if (this.args.gid?.length || this.args.sid?.length) {
      if (this.mobiles?.settings?.allowSelection) {
        console.log(44)
        this.mobiles.selectedChanged = row => {
          console.log(55)
          console.log(JSON.stringify(row))
          let selected = this.mobiles.isSelected(row)
          let i = this.args.selected!.indexOf(row.id)
          let exists = i > -1

          if (selected) {
            if (!exists) {
              this.args.selected!.push(row.id)
            }
            else { }
          }
          else if (!selected) {
            if (!exists) {
              this.args.selected!.push(row.id)
            }
            else {
              this.args.selected!.slice(i, 1)
            }
          }
        }
        console.log(99)

        console.dir(this.args.selected)
      }

      if (this.args.gid?.length) {
        for await (const gm of this.remult.repo(GroupMobile).query({
          where: { group: { $id: this.args.gid! } }
        })) {
          if (gm.mobile) {
            this.args.selected!.push(gm.mobile.id)
            this.mobiles.selectedRows.push(gm.mobile)
          }
        }
      }
      else if (this.args.sid?.length) {
        for await (const gm of this.remult.repo(SmsMobile).query({
          where: { sms: { $id: this.args.sid! } }
        })) {
          if (gm.mobile) {
            this.args.selected!.push(gm.mobile.id)
            this.mobiles.selectedRows.push(gm.mobile)
          }
        }
      }
      console.dir(this.args.selected)

      if (this.mobiles.selectedRows.length) {
        await this.refresh()
      }
    }
  }

  intiGrid() {
    this.mobiles = new GridSettings(this.remult.repo(Mobile), {
      allowCrud: false,
      numOfColumnsInGrid: 10,

      orderBy: { fname: "asc" },
      rowsInPage: 25,
      allowSelection: this.args.multi,

      columnSettings: row => {
        let f = []
        f.push(
          row.fname,
          row.lname,
          row.number)
        if (!this.args.gid?.length ?? false) {
          f.push(
            row.remark,
            row.enabled
          )
        }
        return f
      },
      gridButtons: [
        {
          name: 'רענן',
          icon: 'refresh',
          click: async () => await this.refresh()
        }
      ],
      rowButtons: [
        {
          name: terms.smsim,
          click: async row => {
            await this.assignSmsim(row.id, row.fullName())
          }
        }, {
          name: terms.groups,
          click: async row => {
            await this.assignGroups(row.id, row.fullName())
          }
        }],
      // confirmDelete: async (h) => {
      //   return await this.dialog.confirmDelete(h.name)
      // },
    });
  }

  async refresh() {
    await this.mobiles.reloadData()
  }

  async save() {
    if (this.args.gid?.trim().length) {
      for (const mid of this.args.selected!) {
        if (this.args.gid?.length) {
          let gm = this.remult.repo(GroupMobile).create()
          gm.group = await this.remult.repo(Group).findId(this.args.gid!)
          gm.mobile = await this.remult.repo(Mobile).findId(mid)
          await gm.save()
        }
        else if (this.args.sid?.length) {
          let gm = this.remult.repo(SmsMobile).create()
          gm.sms = await this.remult.repo(Sms).findId(this.args.sid!)
          gm.mobile = await this.remult.repo(Mobile).findId(mid)
          await gm.save()
        }
      }
      // this.win?.close()
    }
  }

  async upsertUser(id = '') {
    let m: Mobile
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון סלולרי'
      m = await this.remult.repo(Mobile).findId(id, { useCache: false })
      if (!m) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת סלולרי'
      m = this.remult.repo(Mobile).create()
      // u.avrech = true
    }

    let isNew = false
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [

          [
            m.$.fname,
            m.$.lname
          ],
          m.$.number,
          m.$.remark,
          m.$.enabled
        ],
        ok: async () => {
          // isNew = u.isNew()
          await m.save()
          if (this.args.gid?.length ?? false) {
            let gm = this.remult.repo(GroupMobile).create()
            gm.group = await this.remult.repo(Group).findId(this.args.gid!)
            gm.mobile = m
            await gm.save()
          }
          else if (this.args.sid?.length ?? false) {
            let gm = this.remult.repo(SmsMobile).create()
            gm.sms = await this.remult.repo(Sms).findId(this.args.sid!)
            gm.mobile = m
            await gm.save()
          }
          else {
            await this.assignGroups(m.id, m.fullName())
            await this.refresh()
          }
        }
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      // await u.save()
      await this.refresh()
    }
  }

  async assignGroups(mid: string, mname = '') {
    if (!mid?.trim().length ?? false) {
      throw 'AssignGroups got mobile-id NOT VALID'
    }
    // let title = 'שיוך סלולרי לקבוצות'
    let title = `שיוך ${mname} לקבוצות`
    let changed2 = await openDialog(GroupsComponent,
      win => win.args = { title: title, mid: mid, multi: true },
      win => win?.args.changed)
    if (changed2) {
      await this.refresh()
    }
  }

  async assignSmsim(mid: string, mname = '') {
    if (!mid?.trim().length ?? false) {
      throw 'assignSmsim got mobile-id NOT VALID'
    }
    // let title = 'שיוך סלולרי לקבוצות'
    let title = `שיוך ${mname} להודעות`
    let changed2 = await openDialog(SmsimComponent,
      win => win.args = { title: title, mid: mid, multi: true },
      win => win?.args.changed)
    if (changed2) {
      await this.refresh()
    }
  }

  async close() {

  }

}
