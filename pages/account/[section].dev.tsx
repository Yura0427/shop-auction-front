import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { Col, Container, Row } from 'reactstrap';
import { LoadingContext } from '../../components/context/loading-context';

import MainLayout from 'components/layout/MainLayout';
import { Header } from 'components/Header/Header';
import { EAccountUrls } from 'interfaces/account/account.enum';
import Orders from 'components/account/orders/orders';
import Advertisements from 'components/account/advertisements/advertisements';
import PersonalInfo from 'components/account/personal-info/personal-info';
import Favorite from 'components/account/favorite/favorite';
import Comments from 'components/account/comments/comments';
import GoBackBtn from 'components/buttons/go-back-btn';
import AccountMenu from 'components/SideMenu/account-menu';
import { useWindowSize } from 'hooks/useWindowSize';
import Footer from 'components/Footer/Footer';
import { useCategories } from 'hooks/useCategories';
import { UserContext } from '../../components/context/user-context';
import { useMounted } from 'hooks/useMounted';
import styles from './account-page.module.scss';
import Bonuses from '../../components/account/bonuses/bonuses';

const AccountItem = () => {
  const router = useRouter();

  const querySection: string = Array.isArray(router.query.section)
    ? router.query.section[0]
    : router.query.section;

  const { user } = useContext(UserContext);

  const { allCategories } = useCategories();

  if (process.browser) {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      router.push('/');
    }
  }

  const renderPage = () => {
    switch (querySection) {
      case EAccountUrls.orders:
        return <Orders />;

      case EAccountUrls.advertisements:
        return <Advertisements />;

      case EAccountUrls.comments:
        return <Comments />;

      case EAccountUrls.favorite:
        return <Favorite />;

      case EAccountUrls.bonuses:
        return <Bonuses />;

      default:
        return <PersonalInfo />;
    }
  };

  const { width } = useWindowSize();
  const { mounted } = useMounted();
  const [isLoading, setLoading] = useState(false);

  const metaData = {
    title: 'Особистий кабінет',
    description: `Особистий кабінет`,
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <LoadingContext.Provider value={{ isLoading, setLoading }}>
        <Header categories={allCategories!} />
        {user && mounted ? (
          <Container className={styles.container}>
            <Row>
              {width > 769 ? (
                <>
                  <Col sm={3}>
                    <div className={styles['btn-container']}>
                      <GoBackBtn />
                    </div>
                    <AccountMenu />
                  </Col>
                  <Col sm={9}>{renderPage()}</Col>
                </>
              )
                  :
                    (
                      <>
                        <Col sm={12}>
                          <div className={styles['btn-container']}>
                            <GoBackBtn />
                          </div>
                          <Col sm={12}>{renderPage()}</Col>
                        </Col>

                      </>
                    )
                  }


            </Row>
          </Container>
        ) : null}
      </LoadingContext.Provider>
      <Footer />
    </MainLayout>
  );
};

export default AccountItem;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = (Array.isArray(params?.page) ? params?.page[0] : params?.page) || null;
  const urls: string[] = Object.values(EAccountUrls);

  if (query && !urls.includes(query)) {
    return { notFound: true };
  }

  return { props: { query } };
};
