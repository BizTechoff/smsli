import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthenticatedGuard, RemultModule } from '@remult/angular';
import { HomeComponent } from './home/home.component';


import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { MobilesComponent } from './core/mobile/mobiles/mobiles.component';
import { SendComponent } from './core/send/send/send.component';
import { SmsimComponent } from './core/sms/smsim/smsim.component';
import { terms } from './terms';
import { AdminGuard } from "./users/AdminGuard";
import { GroupsComponent } from './core/group/groups/groups.component';

const defaultRoute = 'login'
//  terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard], data: { name: terms.home } },
  { path: terms.send, component: SendComponent, canActivate: [AdminGuard] },
  { path: terms.smsim, component: SmsimComponent, canActivate: [AdminGuard] },
  { path: terms.mobiles, component: MobilesComponent, canActivate: [AdminGuard] },
  { path: terms.groups, component: GroupsComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    RemultModule,
  JwtModule.forRoot({
    config: { tokenGetter: () => AuthService.fromStorage() }
  })],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
