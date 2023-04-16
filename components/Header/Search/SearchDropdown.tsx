import React, { FC, useEffect, useState } from 'react';

import useSearch from '../../../hooks/useSearch';
import { IProduct } from '../../../interfaces/product/products';
import style from './Search.module.scss';
import SearchDropdownItem from './SearchDropdownItem';

interface SearchDropdownProps {
  searchQuery: string;
  innerRef: React.Ref<HTMLDivElement>;
  searchToggle: () => void;
  toggleSpinner: (isShow: boolean) => void;
}

const SearchDropdown: FC<SearchDropdownProps> = ({
  searchQuery,
  innerRef,
  searchToggle,
  toggleSpinner,
}) => {
  const { searchResults, isError } = useSearch(searchQuery, 1);
  const [foundProducts, setFoundProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    let wait: NodeJS.Timeout;

    if (searchResults?.length) {
      wait = setTimeout(() => setFoundProducts(searchResults), 500);
    }

    return () => clearTimeout(wait);
  }, [searchResults]);

  useEffect(() => {
    if (foundProducts?.length) {
      toggleSpinner(false);
    } else {
      toggleSpinner(true);
    }
  }, [foundProducts]);

  return (
    <>
      {!isError && foundProducts.length && searchResults?.length ? (
        <div className={style['search-dropdown']} tabIndex={0} ref={innerRef}>
          {foundProducts.slice(0, 6).map((product: IProduct) => (
            <SearchDropdownItem searchToggle={searchToggle} key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SearchDropdown;
