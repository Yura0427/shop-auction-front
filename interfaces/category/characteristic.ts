import { BaseEntity } from '../baseEntity';
import { CharacteristicTypes } from '../product/characteristicType.enum';

export interface ICharacteristic extends BaseEntity {
  name: string;
  description?: string;
  defaultValues?: { values: number[] | string[] };
  type:
    | CharacteristicTypes.RANGE
    | CharacteristicTypes.NUMBER
    | CharacteristicTypes.STRING
    | CharacteristicTypes.JSON
    | CharacteristicTypes.ENUM
    | CharacteristicTypes.BOOLEAN
    | CharacteristicTypes.DATE;
}
