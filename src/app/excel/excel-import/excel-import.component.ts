import { Component } from '@angular/core';
import * as xlsx from 'xlsx'; //https://sheetjs.com/
import { ExcelImportController } from '../excelImportController';

@Component({
  selector: 'app-excel-import',
  template: `
  <div style="display: flex; flex-direction: column; justify-content: center; text-align: center;">
    <div>
        <button color="accent" mat-raised-button onclick="document.getElementById('file').click();">
            <mat-label>הוסף אקסל</mat-label>
            <mat-icon>receipt_long</mat-icon>
        </button>
        <input #fileInput type="file" style="display:none;" id="file" name="file" (input)="onFileInput($event)" />
    </div>
    <!-- <input type="file" (input)="onFileInput($event)" /> -->
    <!-- <br> -->
    <a href="/assets/smslo.schema.mobiles.xlsx">אקסל לדוגמה</a>
  </div>
  `,
  styles: []
})
export class ExcelImportComponent {

  firstRow = 1

  async onFileInput(eventArgs: any) {
    for (const file of eventArgs.target.files) {
      let f: File = file;
      await new Promise((res) => {
        var fileReader = new FileReader();

        fileReader.onload = async (e: any) => {

          // pre-process data
          var binary = "";
          var bytes = new Uint8Array(e.target.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          // call 'xlsx' to read the file
          var oFile = xlsx.read(binary, { type: 'binary', cellDates: true, cellStyles: true });
          let sheets = oFile.SheetNames;
          var dataArray = xlsx.utils.sheet_to_json(oFile.Sheets[sheets[0]], { header: this.firstRow });


          console.log('dataArray', dataArray?.length, JSON.stringify(dataArray))
          let processed = await ExcelImportController.importMobilesFromExcel(dataArray);
          alert("loaded " + processed + " mobiles");
        };
        fileReader.readAsArrayBuffer(f);
      });
      return;//to import the first file only
    }
  }



}