import { BaseEntity } from '../baseEntity';
import { CharacteristicTypes } from "./characteristicType.enum";

export interface ICharacteristicValue extends BaseEntity {
  booleanValue?: boolean;
  dateValue?: Date;
  enumValue?: string[] | number[];
  jsonValue?: JSON;
  numberValue?: number;
  stringValue?: string;
  name: string;
  type: CharacteristicTypes.RANGE |
    CharacteristicTypes.NUMBER |
    CharacteristicTypes.STRING |
    CharacteristicTypes.JSON |
    CharacteristicTypes.ENUM |
    CharacteristicTypes.BOOLEAN |
    CharacteristicTypes.DATE
}