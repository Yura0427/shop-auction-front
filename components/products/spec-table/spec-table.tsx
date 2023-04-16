import React, { FC, ReactNode } from 'react';
import { Table } from 'reactstrap';

import { ICharacteristicValue } from '../../../interfaces/product/characteristicValue';
import { CharacteristicTypes } from '../../../interfaces/product/characteristicType.enum';
import styles from '../products-tabs/product-tabs.module.scss';

interface SpecTableProps {
  name: string;
  characteristicGroup: ICharacteristicValue[];
}

const colorsSizeData = (colorsArr: string[], sizesArr: string[][]): JSX.Element[] => {
  let container: JSX.Element[] = [];
  for (let i = 0; i !== colorsArr.length; i++) {
    container.push(
      <li key={i}>
        {colorsArr[i] !== "common" ? "Колір " + colorsArr[i] : " "} доступний в розмірах: {sizesArr[i].join(', ')}
      </li>
    );
  }
  return container;
};

const SpecTable: FC<SpecTableProps> = ({ name, characteristicGroup }) => {
  const getCharacteristicValue = (characteristic: ICharacteristicValue) => {
    switch (characteristic.type) {
      case CharacteristicTypes.DATE:
        return characteristic.dateValue;
      case CharacteristicTypes.BOOLEAN:
        return characteristic.booleanValue ? 'Так' : 'Ні';
      case CharacteristicTypes.ENUM:
        let value = [];
        for (const item of characteristic.enumValue!) {
          value.push(<li key={item}>{item}</li>);
        }
        return <ul>{value}</ul>;
      case CharacteristicTypes.JSON:
        let colors: string[] = [];
        let sizes: string[][] = [];
        Object.keys(characteristic.jsonValue!).forEach((item) => colors.push(item));
        Object.values(characteristic.jsonValue!).forEach((item) => sizes.push(item));
        return (
          <ul>
            <li>
              <ul>{colorsSizeData(colors, sizes)}</ul>
            </li>
          </ul>
        );
      case CharacteristicTypes.STRING:
        return characteristic.stringValue;
      case CharacteristicTypes.NUMBER:
        return characteristic.numberValue;
      case CharacteristicTypes.RANGE:
        return characteristic.numberValue;
    }
  };

  const tableData = characteristicGroup.map((characteristic) => {
    const characteristicValue = getCharacteristicValue(characteristic);

    return (
      <tr key={characteristic.id}>
        <td className={styles.column_1}>
          <span>{characteristic.name}</span>
        </td>
        <td className={styles.column_2}>{characteristicValue as ReactNode}</td>
      </tr>
    );
  });

  return (
    <Table className={styles.table}>
      {characteristicGroup.length ? <caption className={styles.caption}>{name}</caption> : null}
      <tbody>{tableData}</tbody>
    </Table>
  );
};

export default SpecTable;
