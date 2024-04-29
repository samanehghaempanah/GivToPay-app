import { Injectable } from '@angular/core';
// import { deleteToken, getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class FCMService {

  public constructor(private storageService: StorageService, private baseService: BaseService) { }

  public Connect() {
    return new Promise(async (resolve) => {

      // if (this.storageService.fcmToken) {

      //   this._listen();

      //   resolve(this.storageService.fcmToken);
      // }

      // else {

      //   this.requestPermission().then((fcmToken: any) => {

      //     if (fcmToken) {

      //       this.storageService.fcmToken = fcmToken;

      //       this._listen();

      //       resolve(fcmToken);
      //     }
      //   });
      // }
    });
  }

  public Disconnect() {
    return new Promise(async (resolve) => {
      // if (this.storageService.fcmToken) {

      //   const messaging = getMessaging();

      //   deleteToken(messaging);

      //   resolve(true);
      // }
    });
  }

  private requestPermission() {
    return new Promise(async (resolve, reject) => {

      // if (!isSupported()) { reject(false);; }

      // const messaging = getMessaging();

      // getToken(messaging, { vapidKey: environment.firebase.vapidkey }).then((fcmToken) => {

      //   if (fcmToken) {
      //     resolve(fcmToken);
      //   }

      // }).catch((err) => { reject(err); });
    });

  }

  private _listen() {

    // if (isSupported()) {

    //   const messaging = getMessaging();

    //   onMessage(messaging, (payload: any) => {

    //     // show nitfication
    //     const { title, ...options } = payload.notification;
    //     navigator.serviceWorker.ready.then(registration => { registration.showNotification(title, options); });

    //     // show toast
    //     this.baseService.toast(payload?.notification?.body, 'success', this.baseService.translate('common-btn-confirm'), 10000);

    //   })
    // }
  }
}
