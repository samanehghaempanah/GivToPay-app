import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
  @Input() isMenu: boolean = false;
  @Input() isBack: boolean = false;
  @Input() isCancel: boolean = false;
  @Input() chatStatus: string = '';
  @Input() isTyping: boolean = false;
  @Output() cancelChange = new EventEmitter<any>();


  constructor(public navCtrl: NavController, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() { }

  onBackbutton() {
    this.navCtrl.back();
    this.cancelChange.emit();
  }
}
