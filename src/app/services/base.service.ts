import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

type Colors = 'warning' | 'danger' | 'success' | 'primary' | 'secondary' | 'tertiary' | 'dark';
type Positions = 'top' | 'bottom' | 'middle';

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    constructor(
        private platform: Platform,
        private http: HttpClient,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public navCtrl: NavController,
        private storageService: StorageService) { }

    get authenticated() { if (this.storageService.Token) { return true; } else { return false; } }

    pageName(route: ActivatedRoute) { return route.routeConfig?.component?.name ?? ''; }

    pageUrl(router: Router) {
        return router?.url?.startsWith('/') ? router.url.substring(1) : router.url;
    }

    isNumeric(n: any) { return !isNaN(parseFloat(n)) && isFinite(n); }

    isValidEmail(email: string) { return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); };


    async loading_Show(message: string = 'Please Wait...', duration: number = 10000) {
        let loading = await this.loadingCtrl.create({ message: message, duration: duration });
        loading.present();
        return loading;
    }

    loading_Close(loading: HTMLIonLoadingElement) {
        if (loading != null) { loading.dismiss(); }
    }

    async toast(message: string, color: Colors = 'warning', buttonText: string = '', duration: number = 4000, position: Positions = 'bottom') {
        let toast = await this.toastCtrl.create({ message: message, duration: duration, position: position, color: color, buttons: (buttonText) ? [{ text: buttonText, role: 'cancel', side: 'start' }] : undefined });
        toast.present();
    }

    async confirm(title: string, message: string, submitButtonText: string, cancelButtonText: string) {
        return new Promise(async (resolve, reject) => {
            const confirm = await this.alertCtrl.create({ header: title, message: message, buttons: [{ text: submitButtonText, handler: () => { resolve(true); } }, { text: cancelButtonText, handler: () => { resolve(false); } }] });
            await confirm.present();
        });
    }

    async inputConfirm(title: string, message: string, inputPlaceholder: string, inputValue: string, submitButtonText: string, cancelButtonText: string) {
        return new Promise(async (resolve, reject) => {
            const confirm = await this.alertCtrl.create({ header: title, message: message, cssClass: 'ShowInputConfirm', inputs: [{ name: 'txtinput1', type: 'text', value: inputValue, placeholder: inputPlaceholder }], buttons: [{ text: submitButtonText, handler: (alertData) => { resolve({ submit: true, value: (alertData == null || alertData.txtinput1 == null) ? '' : alertData.txtinput1.trim() }); } }, { text: cancelButtonText, handler: () => { resolve({ submit: false }); } }] });
            await confirm.present();
        });
    }

    private getHttpHeader() {
        return {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Accept': 'application/json'
        };
    }

    httpGET(serviceUrl: string, body: any = null, showLoadingPopup: boolean = false, apiRootUrl: string = environment.apiUrl) {
        return new Promise(async (resolve, reject) => {
            let loading: any; if (showLoadingPopup) { loading = await this.loading_Show(); }
            if (body) {
                let dataParams = new HttpParams().set('serviceData', JSON.stringify(body));
                this.http.get(apiRootUrl + serviceUrl, { headers: this.getHttpHeader(), params: dataParams }).subscribe((res: any) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } resolve(res.Result); }, (err) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } reject(err); });
            }
            else {
                this.http.get(apiRootUrl + serviceUrl, { headers: this.getHttpHeader() }).subscribe((res: any) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } resolve(res.Result); }, (err) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } reject(err); });
            }
        });
    }

    httpPOST(serviceUrl: string, body: any, showLoadingPopup: boolean = false, apiRootUrl: string = environment.apiUrl) {
        return new Promise(async (resolve, reject) => {
            let loading: any; if (showLoadingPopup) { loading = await this.loading_Show(); }
            this.http.post(apiRootUrl + serviceUrl, (body) ? JSON.stringify(body) : {}, { headers: this.getHttpHeader() }).subscribe((res: any) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } resolve(res.Result); }, (err) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } reject(err); });
        });
    }

    httpPUT(serviceUrl: string, body: any, showLoadingPopup: boolean = false, apiRootUrl: string = environment.apiUrl) {
        return new Promise(async (resolve, reject) => {
            let loading: any; if (showLoadingPopup) { loading = await this.loading_Show(); }
            this.http.put(apiRootUrl + serviceUrl, (body) ? JSON.stringify(body) : {}, { headers: this.getHttpHeader() }).subscribe((res: any) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } resolve(res.Result); }, (err) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } reject(err); });
        });
    }

    httpDELETE(serviceUrl: string, showLoadingPopup: boolean = false, apiRootUrl: string = environment.apiUrl) {
        return new Promise(async (resolve, reject) => {
            let loading: any; if (showLoadingPopup) { loading = await this.loading_Show(); }
            this.http.delete(apiRootUrl + serviceUrl, { headers: this.getHttpHeader() }).subscribe((res: any) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } resolve(res.Result); }, (err) => { if (showLoadingPopup && loading) { this.loading_Close(loading); } reject(err); });
        });
    }

    httpUploadFILE(image: any) {
        const formData = new FormData();
        formData.append('file', image);
        return this.http.post(environment.apiUrl + 'File', formData).toPromise();
    }

    //  isAndroidApp(): boolean {
    //     let isAndroid = false;
    //     if(this.platform.is("cordova")){
    //       if (((this.platform.is("android")) && (this.device != null) && (this.device.uuid != null) && (this.device.uuid.length > 0)) || this.platform.is("cordova")) { isAndroid = true; }
    //       return isAndroid;
    //     }else{
    //       return false
    //     }

    // }
    isPwaApp(): boolean {
        let isPwa = false; if (this.platform.is("pwa")) { isPwa = true; }
        return isPwa;
    }

    // loadImage(fileName: string | null, imageType: 'Profile' | 'Banner' | 'Common') {
    //     if (fileName) {
    //         if (fileName.startsWith('http')) { return fileName; }
    //         return environment.apiUrl + fileName;
    //     }
    //     switch (imageType) {
    //         case 'Profile':
    //             return './assets/icon/avatar.png';
    //             break;
    //         default:
    //             return './assets/icon/favicon.png';
    //             break;
    //     }
    // }

    openLink(linkUrl: string | null) {
        if (linkUrl) {
            if (linkUrl.startsWith('http')) { window.open(linkUrl, '_blank'); }
            else { this.navCtrl.navigateForward(linkUrl); }
        }
    }


    takePicture_Resize(maxSize: number) {
        return new Promise((resolve, reject) => {

            var fileuploader: any;
            fileuploader = document.getElementById('fileuploader');

            fileuploader.addEventListener('change', function handler(e: any) {

                var file = fileuploader.files[0];
                if (file != null && file.type.match(/image.*/)) {

                    var reader = new FileReader();
                    reader.onload = function (readerEvt: any) {

                        var img2 = new Image();
                        img2.onload = () => {

                            // Resize the image
                            var canvas = document.createElement('canvas'), max_size = maxSize, width = img2.width, height = img2.height;

                            if (width > height) { if (width > max_size) { height *= max_size / width; width = max_size; } }
                            else { if (height > max_size) { width *= max_size / height; height = max_size; } }

                            canvas.width = width;
                            canvas.height = height;

                            let CantObject = canvas.getContext('2d');
                            if (CantObject) {
                                CantObject.drawImage(img2, 0, 0, width, height);
                            }

                            resolve(canvas.toDataURL(file.type));
                        }

                        img2.src = readerEvt.target.result;
                    };

                    reader.readAsDataURL(file);
                }

                fileuploader.removeEventListener('change', handler);
            });

            fileuploader.click();
        });
    }

}
