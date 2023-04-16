import styles from '../DropdownCategories/DropdownCategories.module.scss';
import React, { FC } from 'react';
import { ICategoryTree } from '../../../interfaces/category/category';
import { Button } from 'reactstrap';
import { BsArrowRight } from 'react-icons/bs';
import apiUrl from '../../../api/config';

interface SubCategoriesListProps {
  subList: Array<ICategoryTree[]>;
  changeDropList: (evt: React.SyntheticEvent<HTMLLIElement>) => void;
}

const SubCategoriesList: FC<SubCategoriesListProps> = ({ subList, changeDropList }) => {
  const dropDownData = subList?.map((listArray, index) => {
    return (
      <div className={styles.mobileDropDown}>
        <ul className={styles.subCategoriesList} key={index}>
          {listArray
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((subCategory) => {
              return (
                <li
                  key={subCategory.id}
                  className={styles.subItem}
                  onClick={changeDropList}
                  data-id={subCategory.id}
                >
                  <Button>
                    <i
                      className={styles.icon}
                      style={{
                        mask: `url(${apiUrl}/static/uploads/icons/${subCategory.key}.svg) no-repeat center / contain`,
                        WebkitMask: `url(${apiUrl}/static/uploads/icons/${subCategory.key}.svg) no-repeat center / contain`,
                      }}
                    />
                    {subCategory.name} <BsArrowRight size={16} className={styles.arrowIcon} />
                  </Button>
                </li>
              );
            })}
        </ul>
      </div>
    );
  });

  return <>{dropDownData}</>;
};

export default SubCategoriesList;
