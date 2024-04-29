import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor() { }

  Get(orderId: number) {
    return new Promise(async (resolve, reject) => {
      // this.baseService.httpGET(preUrl + '/history', true).then((result: any) => { resolve(result); }, (err) => { reject(err); });
      resolve({
        Items:
          [
              {
                Id: '1',
                Title: 'Yogurt',
                Type: 'Pegah',
                Amount: 1,
                Unit: 'Kg',
                Img: '../../assets/icon/yogurt.jpeg',
                Store: 'Walmart',
                Price: 10.0,
                Count: 1,
              },
              {
                Id: '2',
                Title: 'Lemon juice',
                Type: 'Salamat',
                Amount: 1,
                Unit: 'btl',
                Img: '../../assets/icon/lemon.jpeg',
                Store: 'Walmart',
                Price: 17.6,
                Count: 2,
              },
              {
                Id: '3',
                Title: 'Lemon juice',
                Type: 'Salamat',
                Amount: 1,
                Unit: 'btl',
                Img: '../../assets/icon/lemon.jpeg',
                Store: 'Casco',
                Price: 17.6,
                Count: 1,
              },
          ]
      });
    });
  }
}
