import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RemultModule } from '@remult/angular';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';
import { YesNoQuestionComponent } from './common/yes-no-question/yes-no-question.component';
import { InputAreaComponent } from './common/input-area/input-area.component';
import { DialogService } from './common/dialog';
import { AdminGuard } from "./users/AdminGuard";
import { SmsimComponent } from './core/sms/smsim/smsim.component';
import { MobilesComponent } from './core/mobile/mobiles/mobiles.component';
import { SendComponent } from './core/send/send/send.component';
import { GroupsComponent } from './core/group/groups/groups.component';
import { ExcelImportComponent } from './excel/excel-import/excel-import.component';
import { TodaComponent } from './home/toda/toda.component';
import { SmsTextBuilderComponent } from './core/sms/sms-text-builder/sms-text-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    HomeComponent,
    YesNoQuestionComponent,
    InputAreaComponent,
    SmsimComponent,
    MobilesComponent,
    SendComponent,
    GroupsComponent,
    ExcelImportComponent,
    TodaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RemultModule
  ],
  providers: [DialogService, AdminGuard],
  bootstrap: [AppComponent],
  entryComponents: [YesNoQuestionComponent, InputAreaComponent, GroupsComponent, SmsTextBuilderComponent]//,GroupsComponent
})
export class AppModule { }
