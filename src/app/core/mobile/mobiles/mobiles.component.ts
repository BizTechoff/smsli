import { Component, OnInit } from '@angular/core';
import { Fields, getFields, Remult } from 'remult';

import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Roles } from '../../../users/roles';
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
      row.remark
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
    let u: Mobile
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון אברך'
      u = await this.remult.repo(Mobile).findId(id, { useCache: false })
      if (!u) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת אברך'
      u = this.remult.repo(Mobile).create()
      // u.avrech = true
    }

    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [

          [
            u.$.fname,
            u.$.lname
          ],
          u.$.number,
          u.$.remark
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

}
