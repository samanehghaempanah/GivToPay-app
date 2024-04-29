export enum OrderStatus {
  Draft = 0,
  InProgress = 10,
  Ready = 20,
  Paid = 30,
  Delivered = 40,
  Cancel = -1
}

export enum OrderType {
  NotDefined = 0,
  Suggestion = 1,
  Buy = 2
}

export enum ItemStatus {
  Draft = 0,
  Found = 1,
  NotFound = 2,
  Cancel = -1,
}

export enum ValidStatus {
  Soon = 1,
  Valid = 2,
  Expire = 3
}

export enum RequestStatus {
  Waiting = 1,
  Confirmed = 2,
  Reject = 3
}
