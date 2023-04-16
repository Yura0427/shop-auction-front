import React, { FC } from 'react';

import style from './breadcrumbs.module.scss';
import { IBreadcrumbsData } from 'interfaces/breadcrumbsData';
import parse from 'html-react-parser';
import Route from '../route/Route';

interface BreadcrumbsProps {
  breadcrumbsData: IBreadcrumbsData;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbsData }) => {
  if (!breadcrumbsData.isBreadcrumbsShown) return null;

  let currentPath = '';

  const breadcrumbs = breadcrumbsData.breadcrumbs.map((item, index) => {
    if (index > 1 && index < breadcrumbsData.breadcrumbs.length - 1) currentPath += '/';
    currentPath += `${item.key}`;
    return (
      <React.Fragment key={index}>
        {index < breadcrumbsData.breadcrumbs.length - 1 ? (
          <Route href={currentPath}>{parse(item.name)}</Route>
        ) : (
          parse(item.name)
        )}
        {index < breadcrumbsData.breadcrumbs.length - 1 && <span className={style.divider}>/</span>}
      </React.Fragment>
    );
  });

  return <div className={`${style.breadcrumbs} globalBreadCrumbs`}>{breadcrumbs}</div>;
};

export default Breadcrumbs;
