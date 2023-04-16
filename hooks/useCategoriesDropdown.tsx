import React, { Fragment, useState, useMemo } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink } from 'reactstrap';

import { ICategory } from '../interfaces/category/category';
import Route from '../components/route/Route';

export const useCategoriesDropdown = (categories: ICategory[]) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<null | number>(null);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleDropDownClick = (event: React.MouseEvent) => {
    const id = Number(event.currentTarget.getAttribute('data-index'));
    setCategoryId(id);
  };

  const renderDropdownMenu = useMemo(() => {
    return (
      <DropdownMenu>
        {categories.map((category) => (
          <Fragment key={category.id}>
            <DropdownItem onClick={handleDropDownClick} data-index={category.id}>
              <Route href={`/${category.key}`}>
                <NavLink>{category.name}</NavLink>
              </Route>
            </DropdownItem>
          </Fragment>
        ))}
      </DropdownMenu>
    );
  }, [categories]);

  const renderDropdown = () => (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>Категорії</DropdownToggle>
      {renderDropdownMenu}
    </Dropdown>
  );

  return { renderDropdown, categoryId };
};
