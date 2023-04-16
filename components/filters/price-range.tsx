import InputRange, { Range } from 'react-input-range';
import React, { FC } from 'react';
import 'react-input-range/lib/css/index.css';
import styles from './filters.module.scss';
import { IPriceRange } from '../../interfaces/filters/filtersData';

interface PriceRangeFilterProps {
  priceRange: IPriceRange;
  filters: { [key: string]: any };
  priceRangeChange: (value: Range | number) => void;
  priceRangeChangeFinished: (value: Range | number) => void;
}

const PriceRangeFilter: FC<PriceRangeFilterProps> = ({
  priceRange,
  filters,
  priceRangeChange,
  priceRangeChangeFinished,
}) => {
  if (priceRange.max === priceRange.min) return null;

  return (
    <div className={styles.priceRange}>
      <div className={styles.inputHead}>
        <p>Діапазон цін</p>
      </div>
      <InputRange
        formatLabel={(value) => `${value} грн`}
        maxValue={priceRange.max}
        minValue={priceRange.min}
        value={filters.priceRange}
        onChange={priceRangeChange}
        onChangeComplete={priceRangeChangeFinished}
      />
    </div>
  );
};

export default PriceRangeFilter;
