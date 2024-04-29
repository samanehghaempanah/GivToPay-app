import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';

let preUrl = 'Authentication';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(
        public baseService: BaseService,
        public storageService: StorageService) { }


    Login(username: string, password: string) {
        return new Promise(async (resolve, reject) => {
            let body = {
                Username: username,
                Password: password
            };
            this.baseService.httpPOST(preUrl + '/login', body, true).then((result: any) => {
                if (result) {

                    // Set Token to Storage
                    this.storageService.Token = result;

                    // Load User info
                    this.Info().then((resultInfo: any) => { });
                }
            }, (err) => { reject(err); });
        });
    }

    Login_Link(tokenLink: string) {
        return new Promise(async (resolve, reject) => {
            this.baseService.httpPOST(preUrl + '/login/' + tokenLink, null, true).then((result: any) => {
                if (result) {

                    // Set Token to Storage
                    this.storageService.Token = result;

                    resolve(result);
                    
                    // Load User info
                    //this.Info().then((resultInfo: any) => { });
                }
            }, (err) => { reject(err);});
        });
    }

    Logout() {
        return new Promise(async (resolve, reject) => {
            // this.baseService.httpPOST(preUrl + '/logout', null, true).then((result: any) => {
            //     if (result) { resolve(result); }
            // }, (err) => { reject(err); })
            //     .finally(() => { this.storageService.Logout(); });
        });
    }

    Info() {
        return new Promise(async (resolve, reject) => {
            // this.baseService.httpGET(preUrl + '/info').then((result: any) => {
            //     if (result) {
            //         this.storageService.User = result;
            //         resolve(result);
            //     }
            // }, (err) => { reject(err); });
        });
    }

    FCM_Connect(fcmToken: any) {
        return new Promise(async (resolve, reject) => {
            // this.baseService.httpPOST(preUrl + '/fcm/connect', { Token: fcmToken }, true).then((result: any) => { resolve(result); }, (err) => { reject(err); });
        });
    }

    FCM_Disconnect(fcmToken: any) {
        return new Promise(async (resolve, reject) => {
            // this.baseService.httpPOST(preUrl + '/fcm/disconnect', { Token: fcmToken }, true).then((result: any) => { resolve(result); }, (err) => { reject(err); });
        });
    }
}
