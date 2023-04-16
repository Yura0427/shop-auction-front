import React, { FC } from 'react';
import { Col, Spinner } from 'reactstrap';
import { useRouter } from 'next/router';

import style from './sidebar.module.scss';
import { useCategory } from '../../hooks/useCategory';
import Filters from '../filters/filters';
import { getLastUrlSegment } from '../../utils/urlValidation';

interface SideBarProps {
  isShown: boolean | undefined;
}

const SideBar: FC<SideBarProps> = ({ isShown }) => {
  if (!isShown) return null;
  const categoryQuery = getLastUrlSegment(useRouter().query.slug as string[]);
  const { category: relatedCategory, isLoading } = useCategory(categoryQuery);

  if (isLoading && isShown) {
    return (
      <Col sm={isShown ? 3 : 0}>
        <aside className={`${style.sidebar} globalSideBar`}>
          <Spinner color="success" />
        </aside>
      </Col>
    );
  }

  if (relatedCategory && isShown) {
    const filteredGroups = relatedCategory.characteristicGroup?.filter(
      (group) => group.characteristic.length
    );

    return (
      <Col sm={isShown ? 3 : 0}>
        <aside className={`${style.sidebar} globalSideBar`}>
          <Filters filteredGroups={filteredGroups!} priceRange={{ ...relatedCategory.priceRange! }} />
        </aside>
      </Col>
    );
  }

  return null;
};

export default SideBar;
