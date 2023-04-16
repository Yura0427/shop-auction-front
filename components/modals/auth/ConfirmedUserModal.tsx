import React, { FC } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import styles from './confirmedUser.module.scss';

export interface AuthModalProps {
  toggleConfirmed: () => void;
  confirmedModal: boolean;
}

const ConfirmedUserModal: FC<AuthModalProps> = ({ confirmedModal, toggleConfirmed }) => {
  return (
    <Modal
      isOpen={confirmedModal}
      centered={true}
      unmountOnClose={false}
      toggle={toggleConfirmed}
      style={{ width: 450 }}
    >
      <ModalBody className={styles.modalBody}>
        <h3>Реєстрація успішна</h3>
        <h5>Підтвердіть Ваш email для завершення реєстрації</h5>
        <button onClick={toggleConfirmed} className={styles.button}>
          ОК
        </button>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmedUserModal;
