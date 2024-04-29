import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor() {}

  GET() {
    return new Promise(async (resolve, reject) => {
      // this.baseService.httpGET(preUrl + '/history', true).then((result: any) => { resolve(result); }, (err) => { reject(err); });
      resolve({
        Items: [
          {
            Id: 1,
            Title: 'Yogurt',
            Amount: 1,
            Unit: 'Kg',
            Brand: 'Pegah',
            Items: [
              {
                Id: '1',
                Title: 'Yogurt',
                Type: 'Type 1',
                Amount: 1,
                Unit: 'Kg',
                Img: '../../assets/icon/Rectangle1.png',
                Store: 'Walmart',
                Price: 12.25,
                Count: 0,
                Brand: 'Pegah',
              },
              {
                Id: '2',
                Title: 'Yogurt',
                Type: 'Type 2',
                Amount: 1,
                Unit: 'Kg',
                Img: '../../assets/icon/Rectangle2.png',
                Store: 'Walmart',
                Price: 10,
                Count: 0,
                Brand: 'Pegah',
              },
              {
                Id: '3',
                Title: 'Yogurt',
                Type: 'Type 3',
                Amount: 1,
                Unit: 'Kg',
                Img: '../../assets/icon/Rectangle3.png',
                Store: 'Casco',
                Price: 12.25,
                Count: 0,
                Brand: 'Pegah',
              },
              {
                Id: '4',
                Title: 'Yogurt',
                Type: 'Type 4',
                Amount: 1,
                Unit: 'Kg',
                Img: '../../assets/icon/Rectangle1.png',
                Store: 'Reddit',
                Price: 12.25,
                Count: 0,
                Brand: 'Pegah',
              },
            ],
          },
          {
            Id: 2,
            Title: 'Lemon juice',
            Amount: 1,
            Unit: 'btl',
            Brand: 'Salamat',
            Items: [
              {
                Id: '5',
                Title: 'Lemon juice',
                Type: 'Type 1',
                Amount: 0,
                Unit: '',
                Img: '../../assets/icon/lemon1.png',
                Store: 'Walmart',
                Price: 12.25,
                Count: 0,
                Brand: 'Salamat',
              },
              {
                Id: '6',
                Title: 'Lemon juice',
                Type: 'Type 2',
                Amount: 0,
                Unit: '',
                Img: '../../assets/icon/lemon2.png',
                Store: 'Casco',
                Price: 10,
                Count: 0,
                Brand: 'Salamat',
              },
              {
                Id: '7',
                Title: 'Lemon juice',
                Type: 'Type 3',
                Amount: 0,
                Unit: '',
                Img: '../../assets/icon/lemon.jpeg',
                Store: 'Walmart',
                Price: 12.25,
                Count: 0,
                Brand: 'Salamat',
              },
            ],
          },
          {
            Id: 3,
            Title: 'Necessary ingredients to prepare dolmeh for 4 people',
            Amount: null,
            Unit: '',
            Brand : '',
            Items: []
          }
        ],
      });
    });
  }
}
