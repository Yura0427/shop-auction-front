import { FC } from 'react';
import { Button, Modal } from 'reactstrap';
import style from './auth.module.scss';

import { IModalProps, EAuthTabs } from 'interfaces/modal';
import { Auth } from '../../auth/Auth';
import { IoMdClose } from 'react-icons/io';

export interface AuthModalProps extends IModalProps {
  headerName?: string;
  activeTab?: number;
  toggleConfirmed?: () => void;
  fastOrder?: boolean | null;
}

export const AuthModal: FC<AuthModalProps> = ({
  toggle,
  toggleConfirmed,
  isOpen,
  headerName = '',
  activeTab = EAuthTabs.login,
}) => {
  const returnToTab = EAuthTabs.register;
  
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      modalClassName={style.fade}
      className={style.modal}
      contentClassName={style.content}
      unmountOnClose={false}
    >
      <Button className={style.close} onClick={toggle}>
        <IoMdClose size={25} color={style.fontColor} />
      </Button>
      <Auth
        toggle={toggle}
        toggleConfirmed={toggleConfirmed}
        headerName={headerName}
        activeTab={activeTab}
        returnToTab={returnToTab}
      />
    </Modal>
  );
};
