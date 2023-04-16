import React, { FC } from 'react';
import { IPageProps } from '../interfaces/page';
import { useCategories } from '../hooks/useCategories';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import MainLayout from '../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import DrawList from '../components/draw/draw-list';

const Draw: FC<IPageProps> = ({ categories }) => {
  const { allCategories } = useCategories(categories);

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs: [
      { name: 'Головна', key: '/' },
      { name: 'Розіграш', key: '/draw' },
    ],
  };

  const metaData = {
    title: 'Розіграш',
    description: 'Розіграш бонусних нарахувань',
    addBrand: false,
  };

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <DrawList />
      </PageContainer>
    </MainLayout>
  );
};

export default Draw;
