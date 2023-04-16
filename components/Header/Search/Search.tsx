import React, { FC, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Container, Spinner } from 'reactstrap';
import { Button, Form, Input } from 'reactstrap';
import { BiSearch } from 'react-icons/bi';
import { useRouter } from 'next/router';

import style from './Search.module.scss';
import { useMedia } from 'hooks/useMedia';
import SearchDropdown from './SearchDropdown';
import styles from '../../SideMenu/SideMenu.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers';
import { setSearchQuery, setShowDropdown } from '../../../store/actions/search.action';

const Search: FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(
    (state: AppState) => state.searchReducer.searchQuery,
    (prev, next) => prev.searchQuery !== next.searchQuery
  );

  const showDropdown = useSelector(
    (state: AppState) => state.searchReducer.showSearchDropdown,
    (prev, next) => prev.showSearchDropdown !== next.showSearchDropdown
  );

  const memoizedSearchQuery = useMemo(() => searchQuery, [searchQuery]);
  const memoizedShowDropdown = useMemo(() => showDropdown, [showDropdown]);

  const router = useRouter();
  const isMobile = useMedia(`(max-width: ${styles.sm}px)`);
  const searchDropdownElement = useRef<HTMLDivElement>(null);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    if (router.query.q) {
      const query = router.query.q as string;
      dispatch(setSearchQuery(query));
    }
  }, [router.query.q]);

  const toggleSpinner = (isShow: boolean) => {
    setSpinner(isShow);
  };

  const searchToggle = () => {
    dispatch(setShowDropdown(false));
  };

  const changeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    if (search.trim().length >= 2) {
      dispatch(setSearchQuery(search));
      dispatch(setShowDropdown(true));
      return;
    }

    dispatch(setSearchQuery(search));
    dispatch(setShowDropdown(false));
  };

  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery) {
      if (searchQuery.trim()) router.push(`/search?q=${searchQuery}&page=1`);
      dispatch(setShowDropdown(false));
    }
  };

  const onBlurSearchInput = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!searchDropdownElement.current?.contains(e.relatedTarget as Node)) {
      dispatch(setShowDropdown(false));
      return;
    }

    e.currentTarget.focus();
  };

  return (
    <Container className={style.container}>
      <Form onSubmit={searchSubmit} className={style.search_form}>
        <Input
          type="search"
          name="search"
          placeholder="Пошук"
          autoComplete="off"
          className={style.search_form__search_input}
          value={memoizedSearchQuery}
          onChange={changeSearchInput}
          onBlur={onBlurSearchInput}
        />
        {memoizedShowDropdown && spinner ? (
          <Spinner type="grow" color="success" />
        ) : (
          <Button type="submit" className={style.search_form__btn}>
            <BiSearch size={24} color={isMobile ? 'gray' : 'white'} />
          </Button>
        )}
      </Form>
      {memoizedShowDropdown && (
        <SearchDropdown
          toggleSpinner={toggleSpinner}
          searchToggle={searchToggle}
          searchQuery={memoizedSearchQuery}
          innerRef={searchDropdownElement}
        />
      )}
    </Container>
  );
};

export default Search;
