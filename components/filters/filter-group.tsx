import React, { FC } from 'react';

import { ICharacteristic } from '../../interfaces/category/characteristic';
import FilterItem from './filter-item/filter-item';
import { IFilterReqData } from 'interfaces/filters/filtersData';

interface FilterGroupProps {
  characteristic: ICharacteristic;
  filters: { [key: string]: any };
  filterChange: React.ReactEventHandler;
  filterStringValue: React.ReactEventHandler;
  filtersReq: IFilterReqData;
}

const FilterGroup: FC<FilterGroupProps> = ({
  filtersReq,
  characteristic,
  filterChange,
  filters,
  filterStringValue,
}) => {
  return (
    <FilterItem
      filtersReq={filtersReq}
      key={characteristic.id}
      characteristic={characteristic}
      filters={filters}
      filterChange={filterChange}
      filterStringValue={filterStringValue}
    />
  );
};

export default FilterGroup;
