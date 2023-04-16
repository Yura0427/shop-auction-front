import { ICharacteristicGroup } from '../interfaces/category/characteristicGroup';
import { ICategory } from '../interfaces/category/category';
import { IProduct } from '../interfaces/product/products';
import { ICharacteristic } from '../interfaces/category/characteristic';

export const useCharacteristics = (
  relatedCategory: ICategory,
  relatedProduct: IProduct
): { characteristicGroups: ICharacteristicGroup<ICharacteristic>[] } => {
  const characteristics = [];

  for (const group of relatedCategory.characteristicGroup) {
    characteristics.push(...group.characteristic);
  }

  const characteristicGroups: ICharacteristicGroup<ICharacteristic>[] =
    relatedCategory.characteristicGroup.map((group) => {
      return {
        name: group.name,
        characteristic: [],
      };
    });

  for (let i = 0; i < relatedCategory.characteristicGroup.length; i++) {
    for (let j = 0; j < relatedCategory.characteristicGroup[i].characteristic.length; j++) {
      const result = relatedProduct.characteristicValue.find((characteristic) => {
        return (
          characteristic.name === relatedCategory.characteristicGroup[i].characteristic[j].name &&
          characteristic.type === relatedCategory.characteristicGroup[i].characteristic[j].type
        );
      });
      if (result) characteristicGroups[i].characteristic.push(result);
    }
  }

  return {
    characteristicGroups,
  };
};
