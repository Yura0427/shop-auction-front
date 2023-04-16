import React, { FC, useContext, useEffect, useState } from 'react';
import Select from 'react-select';

import { SelectBlockProps } from '../../../interfaces/product/products';
import { useColorSize } from '../../../hooks/products/useColorSize';
import { SelectActionType } from '../../../enums/selectActionType';
import { ISizeColorSelect } from '../../../interfaces/product/products';
import { SizeContext } from '../../context/sizes-context';
import { getColorPictureUrl } from '../../../utils/get-color-picture-url';
import { IColororsPictures } from 'interfaces/colorsPictures.interface';
import { ICharacteristicValue } from '../../../interfaces/product/characteristicValue';

import styles from './product-select.module.scss';
import { useSizeSorting } from '../../../hooks/products/useSizeSorting';

interface ProductSelectProps extends SelectBlockProps {
  action: keyof typeof SelectActionType;
  disableColorSize?: boolean;
  currentColors?: IColororsPictures[];
  characteristicsValue?: ICharacteristicValue[];
  colorSizeInCart?: any;
}

const ProductSelect: FC<ProductSelectProps> = ({
  action,
  productId,
  characteristicsValue,
  disableColorSize,
  colorSizeInCart,
  currentColors = [],
}) => {
  const { init, existChar, onChangeHandler } = useColorSize(
    action,
    characteristicsValue,
    productId
  );

  if (!init || !existChar?.jsonValue || disableColorSize) return null;

  const [currentSizes, setCurrentSizes] = useState<ISizeColorSelect[] | null>([]);
  const [isShowSizeSelect, setIsShowSizeSelect] = useState<boolean>(false);
  const { isCurrentColor, setIsCurrentColor, setIsCurrentSize } = useContext(SizeContext);

  const [selectedColor, setSelectedColor] = useState<ISizeColorSelect | null>(null);
  const [selectedSize, setSelectedSize] = useState<ISizeColorSelect | null>(null);

  const { sortForSelector } = useSizeSorting();

  let options: { label: string; value: string }[] = [];
  if (action === SelectActionType.color) {
    options = Object.keys(existChar.jsonValue!).map((item) => ({
      value: item,
      label: item,
    }));
  }

  const customStyles = {
    control: (styles: any, state: any) => {
      return {
        ...styles,
        background:
          action === SelectActionType.color
            ? getColorPictureUrl(state.selectProps?.value?.value.trim(), currentColors)
            : undefined,
        fontSize: '10px',
        color: '#fff',
        width: action === SelectActionType.color ? '70px' : undefined,
      };
    },
    container: (styles: any) => {
      return {
        ...styles,
        width: action === SelectActionType.color ? '110px' : undefined,
      };
    },
    option: (styles: any, { data }: any) => {
      return {
        ...styles,
        'fontSize': data.value.trim().length <= 15 ? '12px' : '11px',
        'color': action === SelectActionType.color ? 'transparent' : '#fff',
        'textShadow':
          action === SelectActionType.size
            ? '1px 0 1px #000, 0 1px 1px #000, -1px 0 1px #000, 0 -1px 1px #000'
            : undefined,
        'transition': '0.3s ease',
        'background':
          action === SelectActionType.color
            ? getColorPictureUrl(data.value.trim(), currentColors)
            : undefined,
        'backgroundColor': styles.backgroundColor !== 'transparent' ? '#4e5a5d' : undefined,
        ':hover': {
          backgroundColor: action === SelectActionType.size ? '#d9d8d8' : undefined,
          boxShadow: action === SelectActionType.color ? '0 1px 2px 0 #333' : undefined,
          cursor: 'pointer',
          color: '#fff',
          textShadow:
            action === SelectActionType.color
              ? '1px 0 1px #000, 0 1px 1px #000, -1px 0 1px #000, 0 -1px 1px #000'
              : undefined,
        },
      };
    },
    singleValue: (styles: any) => {
      return {
        ...styles,
        color: action === SelectActionType.color ? 'transparent' : '#4e5a5e',
        fontWeight: action === SelectActionType.size ? '600' : undefined,
        fontSize: action === SelectActionType.size ? '14px' : undefined,
      };
    },
  };

  const onSelectColor = (selectedOption: ISizeColorSelect | null) => {
    if (action === SelectActionType.color && selectedOption?.value) {
      setIsCurrentColor(selectedOption.value);
      setSelectedColor(selectedOption);
    }
    onChangeHandler!(selectedOption);
  };

  const onSelectSize = (selectedOption: ISizeColorSelect | null) => {
    if (action === SelectActionType.size && selectedOption?.value) {
      setIsCurrentSize(selectedOption.value);
      setSelectedSize(selectedOption);
    }
    onChangeHandler!(selectedOption);
  };

  useEffect(() => {
    if (existChar.jsonValue && action === SelectActionType.color) {
      if (!isCurrentColor) {
        setIsCurrentColor(Object.keys(existChar.jsonValue)[0]);
        setSelectedColor(options[0]);
      }
    }
  }, [existChar.jsonValue, isCurrentColor]);

  useEffect(() => {
    if (action === SelectActionType.size && isCurrentColor) {
      const sizes = existChar.jsonValue![
        isCurrentColor as keyof typeof existChar.jsonValue
      ] as unknown as string[];
      if (sizes.length) {
        const sizeOptions = sizes.map((item) => ({
          value: item,
          label: item,
        }));
        setCurrentSizes(sortForSelector(sizeOptions));
        setIsShowSizeSelect(true);
      }
    }
  }, [action, isCurrentColor]);

  useEffect(() => {
    if (currentSizes?.length) {
      setIsCurrentSize(currentSizes[0].value);
      setSelectedSize(currentSizes[0]);
    }
  }, [currentSizes?.length]);

  const hasSizes = Object.entries(existChar.jsonValue).some((el) => el[1].length);

  const colorInCart = options.findIndex((option) => option.value === colorSizeInCart.firstColor);
  const sizeInCart = currentSizes?.findIndex((size) => size.value === colorSizeInCart.firstSize);

  useEffect(() => {
    if (colorInCart !== -1) {
      setIsCurrentColor(options[colorInCart].value);
      setSelectedColor(options[colorInCart]);
    }
    if (currentSizes?.length && sizeInCart !== -1 && sizeInCart !== undefined) {
      setIsCurrentSize(currentSizes[sizeInCart].value);
      setSelectedSize(currentSizes[sizeInCart]);
    }
  }, [sizeInCart, colorInCart, colorSizeInCart.firstColor, colorSizeInCart.firstSize]);

  return (
    existChar.jsonValue && (
      <>
        <div className={styles.productSelect}>
          {isCurrentColor !== 'common' && (
            <span className={styles.selectHead}>
              {action === SelectActionType.color ? 'Колір' : hasSizes ? 'Розмір' : null}
            </span>
          )}
          {action === SelectActionType.size && isCurrentColor === 'common' && (
            <span className={styles.selectHead}>{hasSizes ? 'Розмір' : null}</span>
          )}
          {action === SelectActionType.color && isCurrentColor !== 'common' && (
            <Select
              styles={customStyles}
              hideSelectedOptions={false}
              menuShouldScrollIntoView={false}
              isSearchable={false}
              options={options}
              onChange={onSelectColor}
              placeholder="Оберіть"
              value={selectedColor}
            />
          )}
          {isShowSizeSelect && currentSizes?.length && action === SelectActionType.size && (
            <Select
              styles={customStyles}
              hideSelectedOptions={false}
              menuShouldScrollIntoView={false}
              isSearchable={false}
              options={currentSizes}
              onChange={onSelectSize}
              placeholder="Оберіть"
              value={selectedSize}
            />
          )}
        </div>
      </>
    )
  );
};

export default ProductSelect;
