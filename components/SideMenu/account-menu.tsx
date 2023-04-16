import React, { FC, useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, Nav, NavItem } from 'reactstrap';
import { FcTodoList } from 'react-icons/fc';
// import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { BiCommentDetail } from 'react-icons/bi';
import { MdFavoriteBorder } from 'react-icons/md';
import { RiAccountCircleLine } from 'react-icons/ri';
import { GiCash } from 'react-icons/gi';
import { FiLogOut } from 'react-icons/fi';

import { UserContext } from '../context/user-context';
import classnames from 'classnames';
import { useModal } from '../../hooks/useModal';
import { EAccountPages, EAccountUrls } from 'interfaces/account/account.enum';
import styles from './SideMenu.module.scss';
import { LogoutModal } from '@modals/auth/logoutModal';

interface AccountMenuProps {
  closeSideMenu?: () => void;
}

const AccountMenu: FC<AccountMenuProps> = ({ closeSideMenu }) => {
  const router = useRouter();
  const [logoutState, toggleLogout] = useModal();

  const { user } = useContext(UserContext);

  const goToPath = (route: string) => {
    router.push(`/account/${route}`);
    closeSideMenu && closeSideMenu();
  };

  const querySection = router.query.section;

  return (
    <>
      {user ? (
        <Nav vertical>
          <LogoutModal isOpen={logoutState} toggle={toggleLogout} />
          <NavItem className={styles.navitem}>
            <Button
              onClick={() => goToPath(EAccountUrls.personalInfo)}
              className={classnames({
                [styles['btn-active']]: querySection === EAccountUrls.personalInfo,
              })}
            >
              <RiAccountCircleLine size={20} />
              <span>{EAccountPages.personalInfo}</span>
            </Button>
          </NavItem>
          <NavItem className={styles.navitem}>
            <Button
              onClick={() => goToPath(EAccountUrls.orders)}
              className={classnames({
                [styles['btn-active']]: querySection === EAccountUrls.orders,
              })}
            >
              <FcTodoList size={20} className={styles.history_icon} />
              <span>{EAccountPages.orders}</span>
            </Button>
          </NavItem>
          <NavItem className={styles.navitem}>
            <Button
              onClick={() => goToPath(EAccountUrls.favorite)}
              className={classnames({
                [styles['btn-active']]: querySection === EAccountUrls.favorite,
              })}
            >
              <MdFavoriteBorder size={20} />
              <span>{EAccountPages.favorite}</span>
            </Button>
          </NavItem>
          {/*<NavItem className={styles.navitem}>*/}
          {/*  <Button*/}
          {/*    onClick={() => goToPath(EAccountUrls.advertisements)}*/}
          {/*    className={classnames({*/}
          {/*      [styles['btn-active']]: querySection === EAccountUrls.advertisements,*/}
          {/*    })}*/}
          {/*  >*/}
          {/*    <HiOutlineSpeakerphone size={20} />*/}
          {/*    <span>{EAccountPages.advertisements}</span>*/}
          {/*  </Button>*/}
          {/*</NavItem>*/}
          <NavItem className={styles.navitem}>
            <Button
              onClick={() => goToPath(EAccountUrls.comments)}
              className={classnames({
                [styles['btn-active']]: querySection === EAccountUrls.comments,
              })}
            >
              <BiCommentDetail size={20} />
              <span>{EAccountPages.comments}</span>
            </Button>
          </NavItem>
          <NavItem className={styles.navitem}>
            <Button
              onClick={() => goToPath(EAccountUrls.bonuses)}
              className={classnames({
                [styles['btn-active']]: querySection === EAccountUrls.bonuses,
              })}
            >
              <GiCash size={20} />
              <span>{EAccountPages.bonuses}</span>
            </Button>
          </NavItem>
          <NavItem className={styles.navitem}>
            <Button onClick={toggleLogout}>
              <FiLogOut size={20} />
              <span>Вийти</span>
            </Button>
          </NavItem>
        </Nav>
      ) : null}
    </>
  );
};

export default AccountMenu;
