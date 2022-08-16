import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sms-text-builder',
  templateUrl: './sms-text-builder.component.html',
  styleUrls: ['./sms-text-builder.component.scss']
})
export class SmsTextBuilderComponent implements OnInit {

  args: {
    input: string,
    output?: string
  } = { input: '', output: '' }
  constructor() { }

  ngOnInit(): void {
  }

}
