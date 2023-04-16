import React, { FC, useContext, useState } from 'react';
import { NavItem, Nav, Modal, Button } from 'reactstrap';
import { BsFillStarFill, BsPeopleCircle } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { EAuthTabs } from 'interfaces/modal';

import { CompanyInformation as CompanyInfo } from 'constants/company-information';
import { IPageProps } from '../../interfaces/page';
import { CatalogIcon } from '../svgs/CatalogIcon.svg';
import { CartSvg } from '../svgs/Cart.svg';
import { AuthModal } from '@modals/auth/AuthModal';
import { ContactUs } from '@modals/contact-us/ContactUs';
import CategoriesModal from '../Header/DropdownCategories/CategoriesModal';
import UserBlock from 'components/user-block/user-block';
import AccountMenu from './account-menu';
import { CartHeaderIcon } from '@modals/cart/сartHeaderIcon';
import styles from './SideMenu.module.scss';
import { UserContext } from '../context/user-context';
import { HeaderState } from '../../interfaces/headerState';
import { MdKeyboardArrowDown, MdPayment } from 'react-icons/md';
import Route from '../route/Route';
import { VscFeedback } from 'react-icons/vsc';
import CompanyInformation from '../company-information/CompanyInformation';
import InformationMobileMenu from './information-menu/information-mobile-menu';

type SideMenuProps = {
  isOpen: boolean;
  modalsState: HeaderState;
  toggleConfirmed: () => void;
  toggleContactUs: () => void;
  toggleCategories: () => void;
  openCartModal: () => void;
  openAuth: (tab: number) => void;
  toggleAuthModal: () => void;
  toggleSideMenu: () => void;
} & IPageProps;

const SideMenu: FC<SideMenuProps> = ({
  isOpen,
  modalsState,
  toggleConfirmed,
  toggleContactUs,
  toggleCategories,
  openCartModal,
  openAuth,
  toggleSideMenu,
  toggleAuthModal,
}) => {
  const { user } = useContext(UserContext);
  const [isShowAboutMenu, setIsShowAboutMenu] = useState<boolean>(false);

  const onMenuShowHandler = () => {
    setIsShowAboutMenu(!isShowAboutMenu);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggleSideMenu}
        className={styles.modal}
        contentClassName={styles.content}
        modalTransition={{ baseClass: styles.slide, timeout: { enter: 0, exit: 500 } }}
      >
        <div className={styles.sideMenu}>
          <div className={styles.sideMenuHeader}>
            <div>
              <div className={styles.logo}>
                <Route href={'/'}>buy All</Route>
              </div>
              <Button className={styles.close} onClick={toggleSideMenu}>
                <IoMdClose size={35} color="white" />
              </Button>
            </div>
            <div>
              {!user ? (
                <>
                  <BsPeopleCircle size={35} color="white" />
                  <Button onClick={() => openAuth(EAuthTabs.login)}>Вхід</Button>
                  <span>|</span>
                  <Button onClick={() => openAuth(EAuthTabs.register)}>Реєстрація</Button>
                </>
              ) : (
                <UserBlock closeSideMenu={toggleSideMenu} />
              )}
            </div>
          </div>
          <div className={styles.menu}>
            <Nav vertical>
              <NavItem className={styles.navitem}>
                <Button onClick={toggleCategories}>
                  <CatalogIcon width={20} height={20} />
                  <span>Категорії</span>
                </Button>
              </NavItem>
              <NavItem className={styles.navitem}>
                <Button onClick={openCartModal}>
                  <CartSvg width={20} height={20} />
                  <span>Кошик</span>
                  <div className={styles.basketInfo}>
                    <CartHeaderIcon />
                  </div>
                </Button>
              </NavItem>

              {user ? (
                <div className={styles['account-menu-block']}>
                  <AccountMenu closeSideMenu={toggleSideMenu} />
                </div>
              ) : null}

              {/*<NavItem className={styles.navitem}>*/}
              {/*  <Button>*/}
              {/*    <span>Мова</span>*/}
              {/*  </Button>*/}
              {/*</NavItem>*/}
              <NavItem className={styles.navitem} onClick={() => toggleSideMenu()}>
                <Route href={'/new-arrivals'}>
                  <BsFillStarFill size={18} color={'#f1a12f'} />
                  Новинки
                </Route>
              </NavItem>
              <>
                <NavItem className={styles.navitem} onClick={onMenuShowHandler}>
                  <a>
                    <MdPayment size={18} />
                    Інформація про компанію
                    <MdKeyboardArrowDown size={18} />
                  </a>
                </NavItem>
                {isShowAboutMenu && <InformationMobileMenu toggleSideMenu={toggleSideMenu} />}
              </>
              <NavItem className={styles.navitem}>
                <Button onClick={toggleContactUs}>
                  <VscFeedback size={18} />
                  Зворотній зв'язок
                </Button>
              </NavItem>
            </Nav>
          </div>
          <CompanyInformation
            className={styles['company-info']}
            displayOrder={[CompanyInfo.PHONE_NUMBER_1, CompanyInfo.SСHEDULE]}
          />
        </div>
      </Modal>
      {modalsState.auth.open && (
        <AuthModal
          isOpen={modalsState.auth.open}
          toggle={toggleAuthModal}
          toggleConfirmed={toggleConfirmed}
          activeTab={modalsState.auth.tab}
          fastOrder={false}
        />
      )}
      <ContactUs isOpen={modalsState.contactUs.open} toggle={toggleContactUs} />
      <CategoriesModal isOpen={modalsState.categories.open} toggle={toggleCategories} />
    </>
  );
};

export default SideMenu;
