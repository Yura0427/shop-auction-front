import React, { FC } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Header } from '../../Header/Header';
import { IPageProps } from '../../../interfaces/page';
import SideBar from '../../Sidebar/sidebar';
import Footer from '../../Footer/Footer';
import Breadcrumbs from 'components/breadcrumbs/breadcrumbs';
import { useMedia } from 'hooks/useMedia';
import styles from './container.module.scss';

export const PageContainer: FC<IPageProps> = ({
  children,
  categories,
  isSideBarShown,
  breadcrumbsData,
  customClass,
}) => {
  const isBraikepointLessMD = useMedia(`(max-width: ${styles.md}px)`);
  const isSidebarOpen = !isBraikepointLessMD && isSideBarShown;

  return (
    <>
      <Header categories={categories} />
      <Container className={!customClass ? styles.container : `${styles.container} ${customClass}`}>
        <Breadcrumbs breadcrumbsData={breadcrumbsData!} />
        <Row>
          <SideBar isShown={isSidebarOpen} />
          <Col sm={isSidebarOpen ? 9 : 12}>{children}</Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};
