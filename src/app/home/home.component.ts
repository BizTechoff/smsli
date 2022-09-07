import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { AuthService } from '../auth.service';
import { DialogService } from '../common/dialog';
import { Mobile } from '../core/mobile/mobile';
import { Sms } from '../core/sms/sms';
import { SignInController } from '../users/SignInController';
import { User } from '../users/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sign = new SignInController(this.remult);
  sms = this.remult.repo(Sms).create()
  mobiles = [] as Mobile[]
  userName = ''

  constructor(
    public remult: Remult,
    private dialog: DialogService,
    public auth: AuthService) { }

  async ngOnInit() {
    await this.refresh()
  }

  async refresh() {
  }

  async signIn() {
    // alert('Hi')
    this.auth.setAuthToken(await this.sign.signIn(), this.sign.rememberOnThisDevice);
    let u = await this.remult.repo(User).findId(this.remult.user.id)
    if (u) {
      this.userName = u.name
    }
  }

  async addMobilesFromExcel() {

  }

}
