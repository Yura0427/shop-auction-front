import React, { FC, useContext, useState } from 'react';
import { Container } from 'reactstrap';
import classes from './TopBar.module.scss';

// import { Switch } from 'components/ui/Switch';
import { useModal } from 'hooks/useModal';
import { AuthModal } from '@modals/auth/AuthModal';
import { LogoutModal } from '@modals/auth/logoutModal';
import { EAuthTabs } from 'interfaces/modal';
import AccountDropdown from '../account-dropdown/account-dropdown';
import { UserContext } from '../../context/user-context';
import { useMounted } from 'hooks/useMounted';
import ConfirmedUserModal from '@modals/auth/ConfirmedUserModal';
import { useMedia } from '../../../hooks/useMedia';
import styles from '../../SideMenu/SideMenu.module.scss';
import CompanyInformation from '../../company-information/CompanyInformation';
import { CompanyInformation as CompanyInfo } from 'constants/company-information';

export const TopBar: FC = () => {
  const isMobile = useMedia(`(max-width: ${styles.sm}px)`);

  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const [activeAuthTab, setActiveAuthTab] = useState<number>(EAuthTabs.login);
  const [confirmedModal, setConfirmedModal] = useState(false);

  const toggleConfirmed = () => setConfirmedModal(!confirmedModal);

  const [logoutState, toggleLogout] = useModal();
  const { user } = useContext(UserContext);

  const handleClick = (action: string) => {
    setOpenAuthModal(true);
    action === 'login' ? setActiveAuthTab(EAuthTabs.login) : setActiveAuthTab(EAuthTabs.register);
  };

  const { mounted } = useMounted();

  if (isMobile) return null;

  return (
    <div className={classes.topbar}>
      <Container className={classes.topbar__inner}>
        <CompanyInformation
          className={classes.info}
          displayOrder={[CompanyInfo.SСHEDULE, CompanyInfo.PHONE_NUMBER_1]}
        />
        {confirmedModal && (
          <ConfirmedUserModal confirmedModal={confirmedModal} toggleConfirmed={toggleConfirmed} />
        )}
        {/* <Switch left="УКР" right="РУС" /> */}
        {user && mounted ? (
          <div className={classes.switch}>
            <LogoutModal isOpen={logoutState} toggle={toggleLogout} />
            <AccountDropdown toggleLogout={toggleLogout} />
          </div>
        ) : (
          <>
            {openAuthModal && (
              <AuthModal
                isOpen={openAuthModal}
                toggle={() => setOpenAuthModal(!openAuthModal)}
                toggleConfirmed={toggleConfirmed}
                activeTab={activeAuthTab}
                fastOrder={false}
              />
            )}
            <div className={classes.switch}>
              <span onClick={() => handleClick('login')}>Увійти</span>
              <span>|</span>
              <span onClick={() => handleClick('register')}>Зареєструватися</span>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};
