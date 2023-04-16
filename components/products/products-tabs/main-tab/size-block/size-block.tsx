import React, { FC, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './size-block.module.scss';
import { SelectActionType } from '../../../../../enums/selectActionType';
import { useColorSize } from '../../../../../hooks/products/useColorSize';
import { SelectBlockProps } from '../../../../../interfaces/product/products';
import { SizeContext } from 'components/context/sizes-context';
import { useSizeSorting } from '../../../../../hooks/products/useSizeSorting';

const SizeBlock: FC<SelectBlockProps> = ({ characteristicsValue, productId, sizeFetcher }) => {
  const { init, existChar, onChangeHandler, selectState } = useColorSize(
      SelectActionType.size,
      characteristicsValue,
      productId
  );
  if (!init) return null;

  const { sortForStrings } = useSizeSorting();

  useEffect(() => {
    if (selectState?.selected && sizeFetcher) {
      sizeFetcher(selectState.selected);
    }
  }, [selectState?.selected]);

  const { isCurrentColor, setIsCurrentSize } = useContext(SizeContext);
  const [sizeList, setSizeList] = useState<string[]>([]);
  const [isShowSizeSelection, setIsShowSizeSelection] = useState(false);
  const [sortedSizeList, setSortedSizeList] = useState<string[]>(['']);

  const choosenSize = sizeList.filter((el) => el === selectState?.selected);

  const selectedSize = choosenSize?.length === 1 ? choosenSize[0] : sizeList[0];

  const onClickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrentSize(e.target.value);
    onChangeHandler!(e);
  };

  useEffect(() => {
    const sizeColorObj = existChar?.jsonValue;

    if (isCurrentColor && existChar?.jsonValue) {
      setSizeList(existChar?.jsonValue[isCurrentColor as keyof typeof sizeColorObj] || []);
    }
  }, [isCurrentColor, sizeList, existChar?.jsonValue]);

  useEffect(() => {
    if (sizeList?.length > 0) {
      setSortedSizeList(sortForStrings(sizeList));
    }
  }, [sizeList]);

  useEffect(() => {
    if (sizeList?.length) {
      setIsShowSizeSelection(true);
    }
  }, [sizeList?.length]);

  let sortedSizeListWithoutWords = sortedSizeList.filter((el) => el != 'Колір' && el != 'Цвет');

  useEffect(() => {
    if (!sortedSizeListWithoutWords?.length) {
      setIsShowSizeSelection(false);
    }
  }, [sortedSizeListWithoutWords?.length]);

  useEffect(() => {
    if (selectState) {
      const selectedSize = sizeList.filter((size) => size === Object.values(selectState)[0]);
      if (selectedSize.length > 0) {
        setIsCurrentSize(selectedSize[0]);
      } else {
        setIsCurrentSize(sizeList[0]);
      }
    }
  }, [selectState, isCurrentColor, sizeList]);

  return (
      <>
        {existChar && (
            <div className={styles.sizeBlock}>
              {isShowSizeSelection && (
                  <>
                    <span className={styles.sizeHead}>Оберіть розмір</span>
                    <div className={styles.wrapper}>
                      {sortedSizeListWithoutWords.map((item, index) => (
                          <React.Fragment key={index}>
                            <input
                                className={styles.sizeBox}
                                id={`size_${item}`}
                                type="radio"
                                value={item}
                                name={'size'}
                                checked={selectedSize === item}
                                onChange={onClickHandler}
                            />
                            <label
                                className={classNames(styles.label, {
                                  [styles.active]: selectedSize === item,
                                })}
                                htmlFor={`size_${item}`}
                            >
                              {item ? item : null}
                            </label>
                          </React.Fragment>
                      ))}
                    </div>
                  </>
              )}
            </div>
        )}
      </>
  );
};

export default SizeBlock;
