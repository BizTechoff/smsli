import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sms-text-builder',
  templateUrl: './sms-text-builder.component.html',
  styleUrls: ['./sms-text-builder.component.scss']
})
export class SmsTextBuilderComponent implements OnInit {

  @ViewChild('textArea') _textArea!: ElementRef;

  text = ''
  args: {
    input: string,
    output?: string
  } = { input: '', output: '' }
  constructor() { }

  ngOnInit(): void {
  }

  caretPos: number = 0;
  getCaretPos() {
    const textArea = this._textArea.nativeElement as HTMLTextAreaElement;
    if (textArea.selectionStart >= 0) {
      this.caretPos = textArea.selectionStart;
    }
  }

  ngAfterViewInit(): void {
    const textArea = this._textArea.nativeElement as HTMLTextAreaElement;
    textArea.focus()
    textArea.setSelectionRange(0, 0);
  }

  addTag(tag = '') {
    console.log('tag', tag)
    if (tag?.trim().length) {
      this.getCaretPos()
      const textArea = this._textArea.nativeElement as HTMLTextAreaElement;
      let content = textArea.value?.trim() ?? ''
      content = content.slice(0, this.caretPos)
        + ' ' + tag + ' '
        + content.slice(this.caretPos)
      textArea.value = content //.trim()
      console.log('content', content)
    }
  }

}
