import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';

import { GridSettings } from '@remult/angular/interfaces';
import { DialogService } from '../../../common/dialog';
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

}
