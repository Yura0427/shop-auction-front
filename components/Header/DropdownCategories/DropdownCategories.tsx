import React, { FC, useState, useRef, useEffect } from 'react';
import { BsArrowRight } from 'react-icons/bs';

import classes from './DropdownCategories.module.scss';
import { ICategoryTree } from '../../../interfaces/category/category';
import Route from '../../route/Route';
import apiUrl from '../../../api/config';

interface IDCProps {
  isOpen: boolean;
  categories: ICategoryTree[];

  dropdownHide(): void;

  onInnerNavHover?: (evt: EventTarget & Element) => void;
}

const styles = {
  wrapStyles: {},
  innerDropdownStyles: {},
};

export const DropdownCategories: FC<IDCProps> = ({
  isOpen,
  categories,
  dropdownHide,
  onInnerNavHover,
}) => {
  if (!isOpen) {
    return null;
  }

  const categoriesUL: React.RefObject<any> = useRef();

  useEffect(() => {
    const ulPosition = categoriesUL.current.getBoundingClientRect();

    styles.wrapStyles = {
      position: 'fixed',
      left: ulPosition.left + ulPosition.width - 15,
      top: ulPosition.top,
    };

    styles.innerDropdownStyles = {
      minHeight: ulPosition.height - 1,
    };
  }, [isOpen]);

  const hasChildren = (category: ICategoryTree): boolean => {
    return !!category.children.length;
  };

  const [activeCategory, setActiveCategory] = useState('');
  const changeCategory = (evt: React.MouseEvent) => {
    setActiveCategory(evt.currentTarget.textContent!);
    onInnerNavHover && onInnerNavHover(evt.currentTarget);
  };

  const makeDynamicIconStyle = (category: ICategoryTree) => {
    return {
      mask: `url(${apiUrl}/static/uploads/icons/${category.key}.svg) no-repeat center / contain`,
      WebkitMask: `url(${apiUrl}/static/uploads/icons/${category.key}.svg) no-repeat center / contain`,
    };
  };

  const desktopList = categories
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((mainCategory) => (
      <li key={mainCategory.id} onMouseEnter={changeCategory}>
        <div onClick={dropdownHide}>
          <Route href={`/${mainCategory.key}`}>
            <span className={classes.mainIconName}>
              <i className={classes.icon} style={makeDynamicIconStyle(mainCategory)} />
              {mainCategory.name}
            </span>
          </Route>
        </div>

        {activeCategory && activeCategory.startsWith(mainCategory.name) && (
          <div className={classes.wrap} style={styles.wrapStyles}>
            <ul className={classes.innerDropdown} style={styles.innerDropdownStyles}>
              {mainCategory.children
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((subLevel_1) => (
                  <li key={subLevel_1.id}>
                    <Route
                      linkClass={classes.subLevel_1}
                      href={`/${mainCategory.key}/${subLevel_1.key}`}
                    >
                      <i className={classes.icon} style={makeDynamicIconStyle(subLevel_1)} />
                      {subLevel_1.name}
                    </Route>
                    {hasChildren(subLevel_1) && (
                      <div className={classes.subBlock}>
                        <ul>
                          {subLevel_1.children.map(
                            (subLevel_2) =>
                              !subLevel_2.disabled &&
                              !subLevel_2.disabledByAdmin && (
                                <li key={subLevel_2.id}>
                                  <Route
                                    href={`/${mainCategory.key}/${subLevel_1.key}/${subLevel_2.key}`}
                                  >
                                    {subLevel_2.name}
                                  </Route>
                                </li>
                              )
                          )}
                        </ul>
                        <Route href={`/${mainCategory.key}/${subLevel_1.key}`}>
                          Весь розділ <BsArrowRight size={16} />
                        </Route>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </li>
    ));

  return (
    <ul className={classes.categories} ref={categoriesUL}>
      {desktopList}
    </ul>
  );
};
