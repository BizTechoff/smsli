import { Component, OnInit } from '@angular/core';
import { Fields, getFields, Remult } from 'remult';

import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Roles } from '../../../users/roles';
import { Sms } from '../sms';


@Component({
  selector: 'app-smsim',
  templateUrl: './smsim.component.html',
  styleUrls: ['./smsim.component.scss']
})
export class SmsimComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<SmsimComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש הודעה' })
  search = ''

  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  smsim = new GridSettings(this.remult.repo(Sms), {
    allowDelete: true,
    allowInsert: true,
    allowUpdate: true,
    numOfColumnsInGrid: 10,

    orderBy: { byName: "asc" },
    rowsInPage: 25,

    columnSettings: row => [
      row.byName,
      row.date,
      row.time,
      row.text
    ],
    rowButtons: [{
      name: terms.resetPassword,
      click: async () => {

        // if (await this.dialog.yesNoQuestion(terms.passwordDeleteConfirmOf + " " + this.row.currentRow.name)) {
        //   await this.smsim.currentRow.resetPassword();
        //   this.dialog.info(terms.passwordDeletedSuccessful);
        // };
      }
    }, {
      name: terms.mobiles,
      click: async () => {
      }
    }
    ],
    // confirmDelete: async (h) => {
    //   return await this.dialog.confirmDelete(h.name)
    // },
  });

  ngOnInit() {
  }

  async refresh() {
    await this.smsim.reloadData()
  }

  async upsertUser(id = '') {
    let u: Sms
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון אברך'
      u = await this.remult.repo(Sms).findId(id, { useCache: false })
      if (!u) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת אברך'
      u = this.remult.repo(Sms).create()
      // u.avrech = true
    }

    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [

          u.$.byName,
          [u.$.date,
          u.$.time],
          u.$.text
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

}
