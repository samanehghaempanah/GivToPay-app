import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { OrderStatus, OrderType, RequestStatus, ValidStatus } from 'src/app/definitions/models/DataTypes.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  PageData = {
    Waiting: false, Loaded: false, Token: '',
    requestBtn: false, requestStatus: 0,
    validFrom: '', validTo: '', validStatus: 0,
    countDown: null, counter: 0
  };

  OrderStatus = OrderStatus;
  ValidStatus = ValidStatus;
  RequestStatus = RequestStatus;

  constructor(
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private orderService: OrderService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() { this.PageData.Token = this.route.snapshot.paramMap.get('token') ?? ''; }

  ionViewDidEnter() { this.onLogin(); }

  ngOnDestroy() { this.PageData.countDown = null; }

  async onLogin() {
    if (!this.PageData.Waiting) {

      this.PageData.Waiting = true;

      if (this.PageData.Token) {

        try {

          let loginResult: any = await this.authService.Login_Link(this.PageData.Token);

          if (loginResult) {

            if (!loginResult.Token || loginResult.Token.length === 0) { this.onValidationTime(loginResult); }

            else { await this.loadData(); }

          }
        } catch { }
      }
      
      this.PageData.Waiting = false;

      this.PageData.Loaded = true;
    }
  }

  async loadData() {

    if (this.appComponent.ChatHUB.isConnect) { await this.appComponent.ChatHUB.Disconnect(); }

    this.appComponent.ChatHUB.Connect();

    let shoppingResult = await this.orderService.Last();

    if (shoppingResult) {

      if (shoppingResult.Status === OrderStatus.Draft) { this.navCtrl.navigateRoot('shopping/' + shoppingResult.OrderNumber); }

      else if (shoppingResult.Status === OrderStatus.InProgress) {

        if (shoppingResult.Type === OrderType.Buy) { this.navCtrl.navigateRoot('order/' + shoppingResult.OrderNumber); }

        else { this.navCtrl.navigateRoot('suggestion/' + shoppingResult.OrderNumber); }
      }

      else if (shoppingResult.Status === OrderStatus.Ready) { this.navCtrl.navigateRoot('basket/' + shoppingResult.OrderNumber); }

      else { this.navCtrl.navigateRoot('history/'); }
    }
  }

  async onValidationTime(loginResult: any) {

    this.PageData.validFrom = loginResult.Conversation_ValidFrom;
    this.PageData.validTo = loginResult.Conversation_ValidTo;

    // Get the current system time
    const systemTime = new Date().getTime();

    // Set the Conversation_ValidFrom and ExpireDate times
    const validFrom = new Date(loginResult.Conversation_ValidFrom).getTime();
    const expireDate = new Date(loginResult.Conversation_ValidTo).getTime();

    // Compare the system time with the validFrom and expireDate times
    if (systemTime < validFrom) {
      this.PageData.validStatus = ValidStatus.Soon;
      const timer = setInterval(() => {
        const remainingTime = validFrom - Date.now();
        if (remainingTime < 0) {
          clearInterval(timer);
          this.PageData.counter = 0;
          this.PageData.validStatus = ValidStatus.Valid;
        }
        const remainingSeconds = Math.floor(remainingTime / 1000);
        this.PageData.counter = remainingSeconds;
      }, 1000)
    } else if (systemTime >= validFrom && systemTime <= expireDate) {
      this.PageData.validStatus = ValidStatus.Valid;
      this.PageData.counter = 0;
    } else {
      this.PageData.validStatus = ValidStatus.Expire;
      this.PageData.counter = 0;
    }
  }

  onRequestBtn() {
    this.PageData.requestBtn = true;
    this.PageData.requestStatus = RequestStatus.Waiting;
  }
}
