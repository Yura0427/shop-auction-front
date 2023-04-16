import React, { FC, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './color-block.module.scss';
import { SelectActionType } from '../../../../../enums/selectActionType';
import { useColorSize } from '../../../../../hooks/products/useColorSize';
import { SelectBlockProps } from '../../../../../interfaces/product/products';
import { SizeContext } from '../../../../context/sizes-context';
import { getColorsPictures } from '../../../../../utils/get-colors-pictures';
import { IColororsPictures } from '../../../../../interfaces/colorsPictures.interface';
import { getColorPictureUrl } from '../../../../../utils/get-color-picture-url';

const ColorBlock: FC<SelectBlockProps> = ({ characteristicsValue, productId }) => {
  const { init, existChar, onChangeHandler, selectState } = useColorSize(
    SelectActionType.color,
    characteristicsValue,
    productId
  );
  if (!init) return null;

  const { setIsCurrentColor } = useContext(SizeContext);
  const [currentColors, setCurrentColors] = useState<IColororsPictures[]>([]);

  let colors = Object.keys(existChar?.jsonValue!);

  const onClickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrentColor(e.target.value);
    onChangeHandler!(e);
  };

  useEffect(() => {
    let isLoaded = true;
    getColorsPictures({ colorsNames: colors }).then((data) => {
      if (isLoaded) {
        setCurrentColors(data);
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);

  if(typeof window !=='undefined'){
    if(window.localStorage.getItem('chosenProduct')){
      let parseColor = JSON.parse(window.localStorage.getItem('chosenProduct') as string)
      if(!colors.includes(parseColor.color.selected[0].value) && parseColor.color.selected[0].id === productId ){
        window.localStorage.removeItem('chosenProduct')
      }
    }
  }
  useEffect(() => {
    if (selectState) {
      setIsCurrentColor(Object.values(selectState)[0]);
    }
  }, [selectState]);

  return (
    <>
      {existChar && selectState?.selected !== 'common' && (
        <div className={styles.colorBlock}>
          <span className={styles.colorHead}>
            <span>Колір:</span> {selectState?.selected in existChar?.jsonValue? selectState?.selected : ''}
          </span>
          <div className={styles.wrapper}>
            {colors.length &&
              colors.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    className={styles.colorBox}
                    id={`color_${item}`}
                    type="radio"
                    value={item}
                    name={'color'}
                    checked={selectState?.selected === item}
                    onChange={onClickHandler}
                  />
                  <label
                    className={classNames(styles.label, {
                      [styles.active]: selectState?.selected === item,
                    })}
                    htmlFor={`color_${item}`}
                    style={{
                      background: getColorPictureUrl(item, currentColors),
                    }}
                  />
                </React.Fragment>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ColorBlock;
