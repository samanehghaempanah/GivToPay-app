import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

let preUrl = 'Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(public baseService: BaseService) { }

  async GET() {
    try {
      const result: any = await this.baseService.httpGET(preUrl);

      return result;
    } catch { }
  }

  async POST() {
    try {
      const result: any = await this.baseService.httpPOST(preUrl, '', true);

      return result;
    } catch { }
  }

  async Get(orderNumber: string) {
    try {
      const result: any = await this.baseService.httpGET(
        preUrl + '/' + orderNumber,
        null,
        true
      );

      return result;
    } catch { }
  }

  async Last() {
    try {
      const result: any = await this.baseService.httpGET(
        preUrl + '/last',
        null,
        true
      );

      return result;
    } catch { }
  }

  async Submit(orderNumber: string, submitType: number) {
    try {
      const result: any = await this.baseService.httpPOST(
        preUrl + '/submit/' + submitType + '/' + orderNumber,
        true
      );

      return result;
    } catch { }
  }

  async Item_POST(orderNumber: string, body: any) {
    try {
      const result: any = await this.baseService.httpPOST(
        preUrl + '/item/' + orderNumber,
        body,
        true
      );

      return result;
    } catch { }
  }

  async Item_PUT(itemId: number, body: any) {
    try {
      const result: any = await this.baseService.httpPUT(
        preUrl + '/item/' + itemId,
        body,
        true
      );

      return result;
    } catch { }
  }

  async Item_DELETE(itemId: number) {
    try {
      const result: any = await this.baseService.httpDELETE(
        preUrl + '/item/' + itemId,
        true
      );

      return result;
    } catch { }
  }

  async Ready(orderNumber: string) {
    try {
      const result: any = await this.baseService.httpPOST(preUrl + '/ready/' + orderNumber, true);
      return result;
    } catch { }
  }
  
  async InProgress(orderNumber: string) {
    try {
      const result: any = await this.baseService.httpPOST(preUrl + '/inprogress/' + orderNumber, true);
      return result;
    } catch { }
  }

  async Product_POST(productId: number, quantity: number) {
    try {
      const result: any = await this.baseService.httpPOST(
        preUrl + '/product/' + productId + '/' + quantity,
        false
      );

      return result;
    } catch { }
  }

  async Address(orderNumber: string, body: any) {
    try {
      const result: any = await this.baseService.httpPOST(
        preUrl + '/address/' + orderNumber,
        body,
        true
      );
      return result;
    } catch { }
  }
}
