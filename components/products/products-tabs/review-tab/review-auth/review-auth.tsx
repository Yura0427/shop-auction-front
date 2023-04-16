import React, { FC, useState } from 'react';
import { Button } from 'reactstrap';

import { IBtnLink } from 'interfaces/comment/comment';
import { EAuthTabs } from 'interfaces/modal';
import { AuthModal } from '@modals/auth/AuthModal';
import styles from './review-auth.module.scss';

const BtnLink: FC<IBtnLink> = ({ text, handleClick }) => {
  return (
    <Button color="link" className={styles['btn-link']} type="button" onClick={handleClick}>
      {text}
    </Button>
  );
};

type Props = {
  beginningOfPhrase: string;
  endOfPhrase: string;
};

const ReviewAuth: FC<Props> = ({ beginningOfPhrase, endOfPhrase }) => {
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const [activeAuthTab, setActiveAuthTab] = useState<number>(EAuthTabs.login);

  const onLinkClick = (action: string) => {
    setOpenAuthModal(true);

    action === 'login' ? setActiveAuthTab(EAuthTabs.login) : setActiveAuthTab(EAuthTabs.register);
  };

  return (
    <>
      {openAuthModal && (
        <AuthModal
          isOpen={openAuthModal}
          toggle={() => setOpenAuthModal(!openAuthModal)}
          activeTab={activeAuthTab}
        />
      )}

      <p className={styles['info-text']}>
        {beginningOfPhrase}
        <BtnLink text="увійдіть" handleClick={() => onLinkClick('login')} /> або{' '}
        <BtnLink text="зареєструйтеся" handleClick={() => onLinkClick('register')} />
        {endOfPhrase}
      </p>
    </>
  );
};

export default ReviewAuth;
