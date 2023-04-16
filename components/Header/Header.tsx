import React, { FC, useContext, useState } from 'react';
import { Button, Container } from 'reactstrap';
import cx from 'classnames';
import { FcTodoList } from 'react-icons/fc';
import { BsPeopleCircle } from 'react-icons/bs';
import { useRouter } from 'next/router';

import { useMedia } from 'hooks/useMedia';
import Search from './Search/Search';
import { LoveSvg } from 'components/svgs/Love.svg';
import { TopBar } from './TopBar/TopBar';
import { MainNav } from './MainNav/MainNav';
import CartModal from '@modals/cart/cart';
import SideMenu from '../SideMenu/SideMenu';
import { IPageProps } from '../../interfaces/page';
import { CustomSvg } from '../../interfaces/customSvg';
import { CartHeaderIcon } from '@modals/cart/сartHeaderIcon';
import { CartSvg } from '../svgs/Cart.svg';
import { UserContext } from '../context/user-context';
import { EAccountUrls } from '../../interfaces/account/account.enum';
import { UtilsContext } from '../context/utils-context';
import Route from '../route/Route';
import { EAuthTabs } from '../../interfaces/modal';
import { HeaderState } from '../../interfaces/headerState';
import { CatalogIcon } from '../svgs/CatalogIcon.svg';
import UserAvatar from '../user-avatar';
import CompanyInformation from '../company-information/CompanyInformation';
import { CompanyInformation as CompanyInfo } from 'constants/company-information';
import { UseProductsInCart } from '../../hooks/cart/useProductsInCart';
import { SnackBarContext } from '../context/snackBar-context';

import styles from '../SideMenu/SideMenu.module.scss';
import classes from './Header.module.scss';

export const Header: FC<IPageProps> = ({ categories }) => {
  const { user } = useContext(UserContext);
  const isMobile = useMedia(`(max-width: ${styles.sm}px)`);
  const shouldShowMobileMenu = useMedia(`(max-width: ${styles.md}px)`);
  const isBetweenSmMd = useMedia(`(min-width: 769ıpx) and (max-width: ${classes.md}px)`);
  const { data: order } = UseProductsInCart();
  const router = useRouter();
  const { showSnackBar } = useContext(SnackBarContext);

  const [sideMenuOpen, setSideMenu] = useState(false);
  const { cartOpen, setCartOpen } = useContext(UtilsContext);
  const toggleSideMenu = () => setSideMenu((prevState) => !prevState);

  const styleIconCart: Partial<CustomSvg> = {
    height: !isMobile ? 38 : 32,
    width: !isMobile ? 38 : 32,
  };

  const [modalsState, setModals] = useState<HeaderState>({
    auth: {
      open: false,
      tab: EAuthTabs.login,
    },
    contactUs: {
      open: false,
    },
    categories: {
      open: false,
    },
    confirmed: {
      open: false,
    },
  });

  const toggleConfirmed = () => {
    setSideMenu(false);
    setModals((prevState) => ({ ...prevState, confirmed: { open: !prevState.confirmed.open } }));
  };

  const toggleContactUs = () => {
    setSideMenu(false);
    setModals((prevState) => ({ ...prevState, contactUs: { open: !prevState.contactUs.open } }));
  };
  const toggleCategories = () => {
    setSideMenu(false);
    setModals((prevState) => ({ ...prevState, categories: { open: !prevState.categories.open } }));
  };

  const openCartModal = () => {
    if (order?.liqpayPaymentStatus === "success" && user) {
      showSnackBar('Будь ласка, завершіть спочатку оформлення діючого замовлення.', true);
      router.push('/delivery');
    } else {
      setSideMenu(false);
      setCartOpen(true);
    }
  };

  const openAuth = (action: number) => {
    setModals((prevState) => ({ ...prevState, auth: { open: true, tab: action } }));
  };
  const toggleAuthModal = () => {
    setModals((prevState) => ({
      ...prevState,
      auth: { ...prevState.auth, open: !prevState.auth.open },
    }));
  };

  const headerIcons = user ? (
    <>
      {isBetweenSmMd && (
        <Button onClick={toggleCategories} className={classes.categoryBtn}>
          <CatalogIcon width={38} height={38} fill={'#4c575b'} />
        </Button>
      )}
      <Route href={`/account/${EAccountUrls.orders}`}>
        <FcTodoList className={classes.history_icon} size={38} />        
      </Route>

      <Route href={`/account/${EAccountUrls.favorite}`}>
        <LoveSvg className={cx(classes.love_icon)} width={37} height={37} color={'none'} />
      </Route>
    </>
  ) : null;
  return (
    <header className={classes.shop_header}>
      <TopBar />
      <div className={classes.header}>
        <Container className={classes.container}>
          <section className={classes.logo_section}>
            <div className={classes.header__logo}>
              <Route href="/">buy All</Route>
            </div>
          </section>

          <section className={classes.header__search_section}>
            {isMobile && (
              <Button className={classes.mobileUser} onClick={toggleSideMenu}>
                {user ? <UserAvatar size={'40'} /> : <BsPeopleCircle size={35} color="white" />}
              </Button>
            )}
            <Search />
          </section>
          <section className={classes.header__icons}>
            {headerIcons}
            {isMobile && (
              <>
                <Button onClick={toggleCategories} className={classes.categoryBtn}>
                  <CatalogIcon width={30} height={30} fill={'#4c575b'} />
                  <span>Категорії</span>
                </Button>
                <CompanyInformation
                  className={classes.workInfo}
                  displayOrder={[CompanyInfo.SСHEDULE, CompanyInfo.PHONE_NUMBER_1]}
                />
              </>
            )}
            <div onClick={openCartModal} className={classes.cart}>
              <CartSvg
                className={cx(isMobile ? classes.cart_icon_mobile : classes.cart_icon_pc)}
                width={styleIconCart.width}
                height={styleIconCart.height}
              />
              <CartHeaderIcon />
            </div>
          </section>
        </Container>
      </div>
      <MainNav categories={categories} />
      <CartModal isOpen={cartOpen} />
      {shouldShowMobileMenu && (
        <SideMenu
          isOpen={sideMenuOpen}
          categories={categories}
          toggleCategories={toggleCategories}
          toggleAuthModal={toggleAuthModal}
          toggleConfirmed={toggleConfirmed}
          toggleContactUs={toggleContactUs}
          toggleSideMenu={toggleSideMenu}
          modalsState={modalsState}
          openAuth={openAuth}
          openCartModal={openCartModal}
        />
      )}
    </header>
  );
};
