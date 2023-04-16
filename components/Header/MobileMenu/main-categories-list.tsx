import styles from '../DropdownCategories/DropdownCategories.module.scss';
import { Button } from 'reactstrap';
import React, { FC } from 'react';
import { ICategoryTree } from '../../../interfaces/category/category';
import { BsArrowRight } from 'react-icons/bs';
import apiUrl from '../../../api/config';

interface MainCategoriesList {
  allCategories: ICategoryTree[];
  changeDropList: (evt: React.SyntheticEvent<HTMLLIElement>) => void;
}

const MainCategoriesList: FC<MainCategoriesList> = ({ allCategories, changeDropList }) => {
  return (
    <ul className={styles.mainCategory}>
      {allCategories
        ?.sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((mainCategory) => (
          <li
            data-id={mainCategory.id}
            key={mainCategory.id}
            className={styles.mobileCategoryBox}
            onClick={changeDropList}
          >
            <Button>
              <i
                className={styles.icon}
                style={{
                  mask: `url(${apiUrl}/static/uploads/icons/${mainCategory.key}.svg) no-repeat center / contain`,
                  WebkitMask: `url(${apiUrl}/static/uploads/icons/${mainCategory.key}.svg) no-repeat center / contain`,
                }}
              />
              {mainCategory.name} <BsArrowRight size={16} className={styles.arrowIcon} />
            </Button>
          </li>
        ))}
    </ul>
  );
};

export default MainCategoriesList;
