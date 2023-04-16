import { FC, useContext } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';

import { IModalProps } from 'interfaces/modal';
import style from './auth.module.scss';
import { removeToken, removeUser } from 'services/local-storage-controller';
import { UserContext } from '../../context/user-context';
import { useWindowSize } from '../../../hooks/useWindowSize'

export const LogoutModal: FC<IModalProps> = ({ toggle, isOpen }) => {
  const { setGlobalUser } = useContext(UserContext);
  const { height } = useWindowSize();

  function logoutUser() {
    removeToken();
    removeUser();
    setGlobalUser(null);
    toggle();
  }
  return (
    <Modal isOpen={isOpen} toggle={toggle} className={style.modal_logout}>
      <ModalBody style={{ maxHeight: height - 70 }}>Ви впевнені, що хочете вийти?</ModalBody>
      <ModalFooter className={style.logout_footer}>
        <Button onClick={toggle}>Ні</Button>
        <Button onClick={logoutUser} className={style.yes_button}>
          Так
        </Button>
      </ModalFooter>
    </Modal>
  );
};
