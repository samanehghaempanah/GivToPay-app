export class ListResultModel {
    CurrentPage: number = 0;
    TotalPages: number = 0;
    PageSize: number = 0;
    TotalCount: number = 0;
    HasPrevious: boolean = false;
    HasNext: boolean = false;
    Items: any[] = [];
}

export class FilteringModel {
    PageNumber: number = 1;
    PageSize: number = 100;
    SearchValue: string = '';
    Conditions: FilteringConditionModel[] = [];
    Orders: FilteringOrderModel[] = [];

    AddCondition(key: string, value: any, operation: FilteringOperationType) {
        this.RemoveCondition(key);
        this.Conditions.push({ Key: key, Value: value, Operation: operation });
    }
    RemoveCondition(key: string) {
        this.Conditions = this.Conditions.filter(x => x.Key !== key);
    }

    AddOrder(key: string, orderType: FilteringOrderType) {
        this.RemoveOrder(key);
        this.Orders.push({ Key: key, OrderType: orderType });
    }
    RemoveOrder(key: string) {
        this.Orders = this.Orders.filter(x => x.Key !== key);
    }
}

export class FilteringConditionModel {
    Key: string = "";
    Value: any = null;
    Operation: FilteringOperationType = FilteringOperationType.Equal;
}

export class FilteringOrderModel {
    Key: string = "";
    OrderType: FilteringOrderType = FilteringOrderType.Ascending;
}

export enum FilteringOperationType {
    Equal = 1,
    NotEqual = 2,
    GreaterThan = 3,
    GreaterThanOrEqual = 4,
    LessThan = 5,
    LessThanOrEqual = 6,
    StartWith = 9,
    Contain = 10,
}
export enum FilteringOrderType {
    Ascending = 0,
    Descending = 1,
}
