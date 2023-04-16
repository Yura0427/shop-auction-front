import React, { FC } from 'react';
import Image from 'next/image';

import parse from 'html-react-parser';
import style from './Search.module.scss';
import { IProduct } from '../../../interfaces/product/products';
import apiUrl from '../../../api/config';
import Route from '../../route/Route';

interface ProductProps {
  product: IProduct;
  searchToggle: () => void;
}

const SearchDropdownItem: FC<ProductProps> = ({ product, searchToggle }) => {
  const { name, mainImg, price } = product;
  const previewImg = mainImg
    ? `${apiUrl}/static/uploads/${mainImg.name}`
    : `${apiUrl}/static/uploads/empty-preview.png`;
  const alt = mainImg ? `Фото товару ${name} відсутнє` : `Фото товару ${name}`;
  const baseUrl = product.url;

  return (
    <div onClick={searchToggle} className={style.SearchDropdownItemContainer} key={product.key}>
      <Route href={`${baseUrl}/${product.key}`} linkClass={style.SearchDropdownItem}>
        <div className={style.img}>
          <Image width={40} height={40} src={previewImg} alt={alt} />
        </div>
        <div className={style.name}>{parse(product.name)}</div>
        <div className={style.price}>{price} ₴</div>
      </Route>
    </div>
  );
};

export default SearchDropdownItem;
