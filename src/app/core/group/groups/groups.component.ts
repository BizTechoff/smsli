import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Roles } from '../../../users/roles';
import { GroupMobile } from '../../group-mobile';
import { Mobile } from '../../mobile/mobile';
import { Group } from '../group';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  args: {
    title?: string,
    selected?: string[],
    multi?: boolean,
    changed?: boolean,
    mid?: string
  } = { title: '', selected: [] as string[], multi: false, changed: false, mid: '' }
  constructor(private dialog: DialogService, private remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<GroupsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש הודעה' })
  search = ''

  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  smsim!: GridSettings<Group>

  async ngOnInit() {
    if (!this.args) {
      this.args = { title: '', selected: [] as string[], multi: false, changed: false, mid: '' }
    }
    console.log(11, 'this.args', this.args)
    this.args.selected = this.args.selected ?? [] as string[]
    this.args.multi = this.args.multi ?? false
    this.args.changed = this.args.changed ?? false
    this.args.mid = this.args.mid ?? ''
    this.args.title = this.args.title ?? ''

    console.log(22, 'this.args', this.args)
    this.intiGrid()
    console.log(33)

    if (this.args.mid) {
      if (this.smsim?.settings?.allowSelection) {
        console.log(44)
        this.smsim.selectedChanged = row => {
          console.log(55)
          console.log(JSON.stringify(row))
          let selected = this.smsim.isSelected(row)
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

      for await (const g of this.remult.repo(GroupMobile).query({
        where: { mobile: { $id: this.args.mid! } }
      })) {
        this.args.selected!.push(g.id)
      }
      console.dir(this.args.selected)
    }
  }

  intiGrid() {
    // this.smsim = new GridSettings(this.remult.repo(Group))
    this.smsim = new GridSettings(this.remult.repo(Group), {
      allowCrud: false,
      numOfColumnsInGrid: 15,

      orderBy: { name: "asc" },
      rowsInPage: 25,
      allowSelection: this.args.multi,

      columnSettings: row => [
        { field: row.name, width: '300' }
      ],
      gridButtons: [
        {
          name: 'רענן',
          icon: 'refresh',
          click: async () => await this.refresh()
        }
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
  }

  async refresh() {
    await this.smsim.reloadData()

  }

  async save() {
    if (this.args.mid?.trim().length) {
      for (const gid of this.args.selected!) {
        let gm = this.remult.repo(GroupMobile).create()
        gm.group = await this.remult.repo(Group).findId(gid)
        gm.mobile = await this.remult.repo(Mobile).findId(this.args.mid!)
        await gm.save()
      }
      // this.win?.close()
    }
  }

  async upsertUser(id = '') {
    let u: Group
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון קבוצה'
      u = await this.remult.repo(Group).findId(id, { useCache: false })
      if (!u) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת קבוצה'
      u = this.remult.repo(Group).create()
      // u.avrech = true
    }

    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [
          u.$.name
        ],
        ok: async () => {
          await u.save()
        }
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      // await u.save()
      this.args.changed = true
      await this.refresh()
    }
  }

  async close() {

  }

}
