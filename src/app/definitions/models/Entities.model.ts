import { OrderStatus, OrderType } from "./DataTypes.model";

export class orderModel {
  'OrderNumber': string;
  'Type': OrderType;
  'Type_Title': string;
  'Status': OrderStatus;
  'Status_Title': string;
  'Order_Date': any;
  'Paid': number;
  'TotalPrice': number;
  'Discount': number;
  'Tax': number;
  'ShipmentPrice': number;
  'Address': string;
  'PaymentCode': string;
  'PaymentDate': any;
  'PaymentType': number;
  'PaymentType_Title': string;
  'PaymentStatus': number;
  'PaymentStatus_Title': string;
  'Items': itemModel[];
  'SelectedProducts': ProductModel[];
}

export class itemModel {
  'Id': number;
  'OrderNumber': string;
  'Title': string;
  'Description': string;
  'Quantity': number;
  'Unit': string;
  'Brand': string;
  'Sequence': number;
  'ItemStatus': number;
  'ItemStatus_Title': string;
  'Products': ProductModel[];
  'Editing': boolean = false;
}

export class ProductModel {
  'Id': number;
  'Item_Id': number;
  'Title': string;
  'Quantity': number;
  'Unit': string;
  'Image': string;
  'StoreTitle': string;
  'Price': number;
  'Description': string;
  'Brand': string;
  'LinkOrAddress': string;
  'Tax': number;
  'Sequence': number;
}