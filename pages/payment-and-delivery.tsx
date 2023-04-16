import { GetStaticProps } from 'next';
import React, { FC } from 'react';

import { api } from '../api';
import { useCategories } from '../hooks/useCategories';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import { IPageProps } from '../interfaces/page';
import MainLayout from '../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import styles from './common-page.module.scss';

const Payment: FC<IPageProps> = ({ categories }) => {
  const { allCategories } = useCategories(categories);

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs: [
      { name: 'Головна', key: '/' },
      { name: 'Оплата і доставка', key: '' },
    ],
  };

  const metaData = {
    title: 'Оплата і доставка',
    description: 'Умови оплати і доставки наших товарів.',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <h1 className={styles.heading}>Оплата і доставка</h1>
        <div className={styles.paymentPage}>
          <h2>Як оплатити товар?</h2>
          <h3>1. Банківський переказ</h3>
          <p>
            Повна або часткова (100 грн) передоплата під час оформлення, шляхом грошового переказу
            за реквізитами (ПриватБанк)
          </p>
          <h3>2. Накладений платіж</h3>
          <p>Оплата при отриманні товару у відділенні Нової Пошти</p>
          <h2>Які варіанти доставки можливі?</h2>
          <h3>1. Нова Пошта</h3>
          <ul>
            <li>
              Доставка здійснюється компанією &ldquo;Нова Пошта&rdquo; згідно термінів та графіку
              перевізника.
            </li>
            <li>Відправка здійснюється впродовж 1 &ndash; 3 днів після оформлення замовлення.</li>
            <li>Доставка оплачується отримувачем згідно тарифів перевізника.</li>
          </ul>
          <h3>2. Укрпошта</h3>
          <ul>
            <li>
              Доставка здійснюється компанією &ldquo;Укрпошта&rdquo; згідно термінів та графіку
              перевізника.
            </li>
            <li>Відправка здійснюється впродовж 1 &ndash; 3 днів після оформлення замовлення.</li>
            <li>Доставка оплачується отримувачем згідно тарифів перевізника.</li>
          </ul>
          <p>
            При виборі способу доставки компанією &ldquo;Укрпошта&rdquo; необхідно УТОЧНЮВАТИ її
            можливість.
          </p>
          <h2>Обмін і повернення</h2>
          <p>
            <strong>ОБОВ'ЯЗКОВО</strong> необхідно звернути увагу на те, що товар необхідно
            перевіряти на цілісність безпосередньо у поштовому відділенні, при отриманні.
          </p>
          <p>Інакше всі претензії про негарантійні проблеми товару не будуть прийняті.</p>
          <p>
            Повернення товару можливе лише у випадку виконання умови збереження товарного вигляду,
            пакунку та чека.
          </p>
          <p>
            Обмін товару можливий до 14 днів після отримання, збереження товарного вигляду, пакунку
            та чека. Необхідно <strong>УТОЧНЮВАТИ</strong> чи можливий обмін даного товару.
          </p>
        </div>
      </PageContainer>
    </MainLayout>
  );
};

export default Payment;

export const getStaticProps: GetStaticProps = async () => {
  const { data: categories } = await api.categories.getTree();

  return {
    revalidate: 60,
    props: {
      categories,
    },
  };
};
