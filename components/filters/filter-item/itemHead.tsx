import React, { FC } from 'react';

import styles from '../filters.module.scss';
import { PlusSvg } from '../../svgs/plus.svg';
import { MinusSvg } from '../../svgs/minus.svg';

interface FilterHeadProps {
  name: string;
  isOpen: boolean;
  toggle?: () => void;
}

const FilterHead: FC<FilterHeadProps> = ({ name, isOpen, toggle }) => {
  return (
    <div className={styles.inputHead} onClick={toggle}>
      <p>{name}</p>
      <button type="button" className={styles.filterBtn} color="primary">
        {!isOpen ? <PlusSvg /> : <MinusSvg />}
      </button>
    </div>
  );
};

export default FilterHead;
