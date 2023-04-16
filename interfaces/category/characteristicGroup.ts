import { BaseEntity } from '../baseEntity';

export interface ICharacteristicGroup<T> extends BaseEntity {
  name: string;
  characteristic: Array<T>;
}
