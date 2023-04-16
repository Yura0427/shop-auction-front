import React, { FC, useEffect, useState } from 'react';
import { MdClear } from 'react-icons/md';

import styles from '../filters.module.scss';
import { ICharacteristic } from '../../../interfaces/category/characteristic';
import { CharacteristicTypes } from '../../../interfaces/product/characteristicType.enum';
import { Collapse } from 'reactstrap';
import FilterHead from './itemHead';
import { FilterItemState, initialState } from '../../../interfaces/filters/initialState';
import { api } from 'api';
import { characteristicsValuesByName, charValue } from 'interfaces/characteristicsValues';
import { getLastUrlSegment } from 'utils/urlValidation';
import { useRouter } from 'next/router';
import { useCategory } from 'hooks/useCategory';
import { filterCheckboxNameHelper } from './filterHelper';
import { IFilterReqData } from 'interfaces/filters/filtersData';

interface FilterItemProps {
  characteristic: ICharacteristic;
  filters: initialState;
  filterChange: React.ReactEventHandler;
  filterStringValue: React.ReactEventHandler;
  filtersReq: IFilterReqData;
}

const FilterItem: FC<FilterItemProps> = ({
  characteristic,
  filters,
  filterChange,
  filterStringValue,
  filtersReq,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const stateId = `${characteristic.type}_${characteristic.id}`;

  useEffect(() => {
    const findState = filters[stateId];
    let isInitialChecked = false;

    if (findState) {
      isInitialChecked = Boolean(
        (filters[stateId] as Array<FilterItemState>).find((item) => item.active)
      );
    }

    if (isInitialChecked) setIsOpen(true);
  }, [filters]);

  const getRelatedFilter = (characteristic: ICharacteristic) => {
    switch (characteristic.type) {
      case CharacteristicTypes.BOOLEAN:
        const firstRadio = (filters[stateId] as Array<FilterItemState>)?.find(
          (item) => item.index === 1
        );
        const secondRadio = (filters[stateId] as Array<FilterItemState>)?.find(
          (item) => item.index === 2
        );
        return (
          <>
            <FilterHead isOpen={isOpen} name={characteristic.name} toggle={toggle} />
            <Collapse isOpen={isOpen} className={styles.collapse}>
              <div className={styles.inputGroup}>
                <input
                  className={styles.radio}
                  id={stateId + '_1'}
                  type="radio"
                  name={stateId + '_1'}
                  checked={!filters[stateId] ? false : firstRadio!.active}
                  onChange={filterChange}
                />
                <label htmlFor={stateId + '_1'}>Так</label>
              </div>
              <div className={styles.inputGroup}>
                <input
                  className={styles.radio}
                  id={stateId + '_2'}
                  type="radio"
                  name={stateId + '_2'}
                  checked={!filters[stateId] ? false : secondRadio!.active}
                  onChange={filterChange}
                />
                <label htmlFor={stateId + '_2'}>Ні</label>
              </div>
            </Collapse>
          </>
        );
      case CharacteristicTypes.ENUM:
        return (
          <>
            <FilterHead isOpen={isOpen} name={characteristic.name} toggle={toggle} />
            <Collapse className={styles.collapse} isOpen={isOpen}>
              {(characteristic.defaultValues?.values as Array<number | string>).map(
                (item, index) => {
                  return (
                    <div className={styles.inputGroup} key={`${stateId}_${index}`}>
                      <input
                        className={styles.checkbox}
                        id={`${stateId}_${index + 1}`}
                        name={`${stateId}_${index + 1}`}
                        key={item}
                        type="checkbox"
                        checked={
                          !filters[stateId]
                            ? false
                            : (filters[stateId] as Array<FilterItemState>)[index].active
                        }
                        onChange={filterChange}
                        value={item}
                      />
                      <label htmlFor={`${stateId}_${index + 1}`}>{item}</label>
                    </div>
                  );
                }
              )}
            </Collapse>
          </>
        );
      case CharacteristicTypes.STRING:
        const [loading, setLoading] = useState(true);
        const [data, setData] = useState<characteristicsValuesByName[]>();
        const [charValue, setCharValue] = useState([
          { characteristicsValues_stringValue: 'Для дівчаток', count: 30 },
          { characteristicsValues_stringValue: 'Для хлопчиків', count: 44 },
        ]);
        const router = useRouter();
        const routerQuery = router.query;

        const categoryQuery = getLastUrlSegment(routerQuery.slug as string[]);
        const { category } = useCategory(categoryQuery);
        const priceRange = routerQuery.priceRange
          ? {
              min: +(routerQuery.priceRange as string).split(',')[0],
              max: +(routerQuery.priceRange as string).split(',')[1],
            }
          : category?.priceRange;

        const filtersGroup =
          filtersReq.filtersGroup?.filter(
            (el: { characteristicId: number | undefined }) =>
              el.characteristicId !== characteristic.id
          ) || [];

        useEffect(() => {
          setLoading(true);
          if (characteristic.name === 'Стать')
            setData([
              { characteristicsValues_stringValue: 'Для дівчаток' },
              { characteristicsValues_stringValue: 'Для хлопчиків' },
            ]);
          else
            api.filters.getCharacteristicValuesByNeme(characteristic.id!).then(({ data }) => {
              setData(data);
              // console.log(data)
            });
        }, []);

        useEffect(() => {
          setLoading(true);

          let arr: any = [];
          data?.map((el) =>
            api.filters
              .getProducts({
                priceRange,
                sorting: 'PRICE_ASC',
                take: 9999,
                skip: 0,
                filtersGroup: [
                  {
                    type: characteristic.type,
                    characteristicId: characteristic.id,
                    characteristicName: characteristic.name,
                    values: [el.characteristicsValues_stringValue],
                  },
                  ...filtersGroup,
                ],
                categoryKey: getLastUrlSegment(routerQuery.slug as string[]),
              } as any)
              .then((e) =>{
                arr.push({
                  count: e.data.count,
                  characteristicsValues_stringValue: el.characteristicsValues_stringValue,
                })
                 setLoading(false);
                }
              )
          );
          setCharValue(prev=>arr);
         
        }, [routerQuery]);

        const clearHandler = async () => {
          const routerQuery = router.query;
          delete routerQuery[`${characteristic.name}`];
          await router.push({ query: routerQuery });
        };
        console.log('charValue', charValue);
        return (
          <>
            {/* <div>
              qqqqqqqqqqqqqqqq
              {!loading && charValue?.map((el) => {
                console.log(el);



                return <div>qwwwwwwwwwwwwwwwwwww</div>;
              })}
            </div> */}

            <FilterHead isOpen={isOpen} name={characteristic.name} toggle={toggle} />
            <Collapse className={styles.collapse} isOpen={isOpen}>
              {
                data?.map((el) => {
                  // console.log(charValue);

                  return (
                    <div className={styles.inputGroup} key={el.characteristicsValues_stringValue}>
                      <input
                        id={`${characteristic.name}__${el.characteristicsValues_stringValue}`}
                        className={styles.checkbox}
                        type="checkbox"
                        value={el.characteristicsValues_stringValue}
                        checked={(filters[characteristic.name] as any).includes(
                          el.characteristicsValues_stringValue
                        )}
                        onChange={filterStringValue}
                      />
                      <label
                        htmlFor={`${characteristic.name}__${el.characteristicsValues_stringValue}`}
                      >
                        {filterCheckboxNameHelper(el.characteristicsValues_stringValue)}
                        <span
                          style={{
                            color: '#a0a0a0',
                          }}
                        >
                          {' '}
                          {loading? '...':(charValue[charValue.findIndex((cv) =>
                            
                              cv.characteristicsValues_stringValue ===
                                el.characteristicsValues_stringValue
                            
                          )]?.count)}
                        </span>
                      </label>
                    </div>
                  );
                })}
              {Object.keys(routerQuery).includes(characteristic.name) && (
                <button
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: 0,
                    border: 'none',
                    background: 'transparent',
                  }}
                  onClick={clearHandler}
                >
                  <MdClear color="#a0a0a0" fontSize={16} />
                </button>
              )}
            </Collapse>
          </>
        );
    }
  };

  const inputs = getRelatedFilter(characteristic);

  return <div className={styles.filterItem}>{inputs}</div>;
};

export default FilterItem;
