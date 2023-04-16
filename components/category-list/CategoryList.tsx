import React, { FC } from 'react';

import { ICategory } from '../../interfaces/category/category';
import Route from '../route/Route';
import styles from './categoryList.module.scss';
import { BsArrowRight } from 'react-icons/bs';
import apiUrl from '../../api/config';
import Image from 'next/image';

interface CategoryListProps {
  category: ICategory;
  validUrl: string;
}

const CategoryList: FC<CategoryListProps> = ({ category, validUrl }) => {
  return (
    <ul className={styles.list}>
      {category?.children.map((category) => (
        <li key={category.id}>
          <Route href={`${validUrl}/${category.key}`}>
            <div className={styles.wrapper}>
              <div className={styles.cardHeader}>
                <Image
                  width={260}
                  height={160}
                  src={`${apiUrl}/static/uploads/category/${category.key}.jpg`}
                  alt={'alt'}
                  quality={100}
                />
              </div>
              <div className={styles.cardBottom}>
                <span>{category.name}</span>
                <BsArrowRight size={20} className={styles.arrowIcon} />
              </div>
            </div>
          </Route>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
