export interface ISettings {
  id: number;
  name: ParametersNameEnum;
  settings: ISettingsWidgetsParams;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISettingsWidgetsParams {
  newArrivals: any;
  popularItems: any;
}

export enum ParametersNameEnum {
  widgets = 'widgets',
}
