import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  PageData = {
    Waiting: false, signupURL: '',
    Item: { Username: '', Password: '' },
  };

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() { this.PageData.signupURL = this.route.snapshot.paramMap.get('url') ?? ''; }

  goToVeiw() { this.router.navigate(['./' + this.PageData.signupURL]); }

  async onLogin() {
    this.PageData.Waiting = true;
    this.authService.Login(this.PageData.Item.Username, this.PageData.Item.Password).then(async (result: any) => {
      if (result) {

        if (this.appComponent.ChatHUB.isConnect) { await this.appComponent.ChatHUB.Disconnect(); }
        this.appComponent.ChatHUB.Connect();

        // // connect to chat service
        // this.appComponent.ChatHUB.Connect();

        // // disconnect from FCM if exist
        // this.fcmService.Disconnect().then((fcmToken) => {
        //   if (fcmToken) {
        //     this.authService.FCM_Disconnect(fcmToken);
        //   }
        // });

        // // connect to FCM service
        // this.fcmService.Connect().then((fcmToken) => {
        //   if (fcmToken) {
        //     this.authService.FCM_Connect(fcmToken);
        //   }
        // });

        let returnURL = this.route.snapshot.queryParamMap.get('return');
        if (!returnURL) { returnURL = ''; }
        this.router.navigate(['/' + returnURL]);
      }
    }).finally(() => { this.PageData.Waiting = false; });
  }
}
