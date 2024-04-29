import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() { }

  Logout() {
    localStorage.clear();
  }

  public get User() { return localStorage.getItem('giv2payUser') ? JSON.parse(localStorage.getItem('giv2payUser') || '{}') : null; }
  public set User(value: any) { localStorage.setItem('giv2payUser', JSON.stringify(value)); }

  public set Token(value: any) { localStorage.setItem('giv2payToken', JSON.stringify(value)); }
  public get Token() {
    var token = localStorage.getItem('giv2payToken') ? JSON.parse(localStorage.getItem('giv2payToken') || '{}') : null;
    return (token) ? token.Token : null;
  }
  public get TokenExpireDate() {
    var token = localStorage.getItem('giv2payToken') ? JSON.parse(localStorage.getItem('giv2payToken') || '{}') : null;
    return (token) ? token.ExpireDate : null;
  }

  public setPageSize(pageName: string, value: any) { localStorage.setItem('giv2payPageSize-' + pageName, JSON.stringify(value)); }
  public getPageSize(pageName: string) { return localStorage.getItem('giv2payPageSize-' + pageName) ? JSON.parse(localStorage.getItem('giv2payPageSize-' + pageName) || '{}') : null; }


  public set Chats(value: any) { localStorage.setItem('giv2payChats', JSON.stringify(value)); }
  public get Chats(): any[] { return (localStorage.getItem('giv2payChats')) ? JSON.parse(localStorage.getItem('giv2payChats') || '{}') : []; }

  public setChatMessages(chatId: string, value: any) { localStorage.setItem('giv2payChatMessages-' + chatId, JSON.stringify(value)); }
  public getChatMessages(chatId: string): any[] { return (localStorage.getItem('giv2payChatMessages-' + chatId)) ? JSON.parse(localStorage.getItem('giv2payChatMessages-' + chatId) || '{}') : []; }

  public get resetPassword() { return localStorage.getItem('giv2payresetPassword'); }
  public set resetPassword(value: any) { localStorage.setItem('giv2payresetPassword', value); }
  removeresetPassword() { localStorage.removeItem('giv2payresetPassword'); }

  public get ConfirmCode() { return localStorage.getItem('giv2payConfirmCode'); }
  public set ConfirmCode(value: any) { localStorage.setItem('giv2payConfirmCode', value); }
  removeConfirmCode() { localStorage.removeItem('giv2payConfirmCode'); }

  public set Basket(value: any) { localStorage.setItem('giv2payBasket', JSON.stringify(value)); }
  public get Basket(): any[] { return (localStorage.getItem('giv2payBasket')) ? JSON.parse(localStorage.getItem('giv2payBasket') || '{}') : []; }

  public set Order(value: any) { localStorage.setItem('giv2payOrder', JSON.stringify(value)); }
  public get Order(): any[] { return (localStorage.getItem('giv2payOrder')) ? JSON.parse(localStorage.getItem('giv2payOrder') || '{}') : []; }
}
