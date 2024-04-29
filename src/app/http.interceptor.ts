import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationService } from './services/authentication.service';
import { BaseService } from './services/base.service';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(
        private baseService: BaseService,
        private authService: AuthenticationService,
        private storageService: StorageService,
        private navCtrl: NavController,
        private router: Router) { }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        httpRequest = httpRequest.clone({
            setHeaders: {
                Authorization: `${(this.storageService.Token) ? 'Bearer ' + this.storageService.Token : ' '}`
            }
        });

        return next.handle(httpRequest).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    if (evt.body && evt.body.ExceptionCode > 0) {
                        this.baseService.toast(evt.body.ExceptionMessage, (evt.body.ExceptionCode >= 1000) ? 'warning' : 'danger');
                        if (evt.body.ExceptionCode == 401) {

                            this.authService.Logout();

                            let currentURL = this.baseService.pageUrl(this.router);
                            if (currentURL == '' || currentURL.startsWith('login') || currentURL.startsWith('password')) {
                                this.navCtrl.navigateRoot('/login');
                            }
                            else {
                                this.navCtrl.navigateRoot('/login?return=' + currentURL);
                            }
                        }
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.authService.Logout();
                        this.navCtrl.navigateRoot('/login');
                    } else {
                        // if (error.error.exception) {
                        //     this.baseService.toast(error.error.exception.message, 'danger');
                        // } else {
                        //     this.baseService.toast(error.error.message);
                        // }
                        // this.baseService.toast('Incorrect Request', 'danger');
                    }
                    return throwError(error);
            })
        ) as Observable<HttpEvent<any>>;
    }
}
