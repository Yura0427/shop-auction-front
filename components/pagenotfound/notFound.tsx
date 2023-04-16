import React from 'react';

import style from './notFound.module.scss';
import { useCategories } from 'hooks/useCategories';
import MainLayout from 'components/layout/MainLayout';
import GoBackBtn from 'components/buttons/go-back-btn';
import { PageContainer } from '@containers/page-container';
import { IBreadcrumbsData } from 'interfaces/breadcrumbsData';

const NotFound = () => {
  const metaData = {
    title: 'Сторінка не знайдена',
    description: 'Сторінка не знайдена',
    addBrand: true,
    noIndex: true,
  };

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: false,
    breadcrumbs: [{ name: 'Головна', key: '/' }],
  };

  const { allCategories } = useCategories();
  return (
    <MainLayout metaData={metaData}>
      <PageContainer
        breadcrumbsData={breadcrumbsData}
        categories={allCategories!}
        customClass={style.content}
      >
        <div className={style.notFound}>
          <h1>404</h1>
          <b>
            На жаль, такої сторінки не існує.
            <br />
            Можливо, це посилання застаріле або видалене, скористайтесь пошуком.
          </b>
          <div className={style.home}>
            <GoBackBtn />
          </div>
        </div>
      </PageContainer>
    </MainLayout>
  );
};

export default NotFound;
