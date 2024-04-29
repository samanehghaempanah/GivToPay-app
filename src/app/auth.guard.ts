import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { BaseService } from './services/base.service';
import { NavController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private navCtrl: NavController,
        private router: Router,
        private baseService: BaseService) { }

    canActivate() {
        if (this.baseService.authenticated) {
            return true;
        }

        let currentURL = this.baseService.pageUrl(this.router);
        if (currentURL == '' || currentURL.startsWith('signup') || currentURL.startsWith('password')) {
            this.navCtrl.navigateRoot('/login');
        }
        else {
            this.navCtrl.navigateRoot('/login?return=' + currentURL);
        }
        return false;
    }
}