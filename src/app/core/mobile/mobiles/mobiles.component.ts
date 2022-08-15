import { Component, OnInit } from '@angular/core';
import { Fields, getFields, Remult } from 'remult';

import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Roles } from '../../../users/roles';
import { GroupMobile } from '../../group-mobile';
import { GroupsComponent } from '../../group/groups/groups.component';
import { Mobile } from '../mobile';


@Component({
  selector: 'app-mobiles',
  templateUrl: './mobiles.component.html',
  styleUrls: ['./mobiles.component.scss']
})
export class MobilesComponent implements OnInit {
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

  mobiles = new GridSettings(this.remult.repo(Mobile), {
    allowDelete: true,
    allowInsert: true,
    allowUpdate: true,
    numOfColumnsInGrid: 10,

    orderBy: { fname: "asc" },
    rowsInPage: 25,

    columnSettings: row => [
      row.fname,
      row.lname,
      row.number,
      row.remark,
      row.enabled
    ],
    rowButtons: [{
      name: terms.resetPassword,
      click: async () => {

        // if (await this.dialog.yesNoQuestion(terms.passwordDeleteConfirmOf + " " + this.mobiles.currentRow.name)) {
        //   await this.mobiles.currentRow.resetPassword();
        //   this.dialog.info(terms.passwordDeletedSuccessful);
        // };
      }
    }, {
      name: terms.smsim,
      click: async () => {
      }
    }, {
      name: terms.groups,
      click: async () => {
      }
    }],
    // confirmDelete: async (h) => {
    //   return await this.dialog.confirmDelete(h.name)
    // },
  });

  ngOnInit() {
  }

  async refresh() {
    await this.mobiles.reloadData()
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
          let groups = await this.remult.repo(GroupMobile).find({
            where: { mobile: { $id: m.id } }
          })
          if (groups) {
            let changed2 = await openDialog(GroupsComponent,
              win => win.args = { mid: m.id, multi: true },
              win => win?.args.changed)
            if (changed2) {
              await this.refresh()
            }
          }
        }
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      // await u.save()
      await this.refresh()
    }
  }

}
