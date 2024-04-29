import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss'],
})
export class PageFooterComponent implements OnInit {
  @Input() title: string = '';
  @Input() totalOrder: any;
  @Input() totalCount: any;
  @Input() isNext: boolean = false;
  @Input() nextDisabled: boolean = false;
  @Input() isSubmit: boolean = false;
  @Input() submitDisabled: boolean = false;
  @Output() nextChange = new EventEmitter<any>();
  @Output() submitChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onNextbutton() {
    this.nextChange.emit();
  }

  onSubmitbutton() {
    this.submitChange.emit();
  }

}
