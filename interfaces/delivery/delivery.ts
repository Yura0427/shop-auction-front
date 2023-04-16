export interface IAddDelivery {
  areaName: string;
  cityName: string;
  cityFullName: string;
  cityRef: string;
  streetName: string;
  streetRef: string;
}

export interface IGetDelivery {
  id: number;
  areaName: string;
  cityName: string;
  cityFullName: string;
  cityRef: string;
  streetName: string;
  streetRef: string;
}

export interface ICity {
  Area: string;
  Present: string;
  DeliveryCity: string;
  MainDescription: string;
  Description: string;
  AreaDescription: string;
  Ref: string;
}

export interface ISetCity {
  Area: string;
  DeliveryCity: string;
  MainDescription: string;
  value: string;
  label: string;
}

export interface IStreet {
  Description: string;
  Ref: string;
  value: string;
}

export interface ISetStreet {
  Ref: string;
  value: string;
  label: string;
}

export interface ISetDeliveryMethod {
  value: string;
  label: string;
}
