import React, { FC } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useRouter } from 'next/router';

import styles from './OpenOrderModal.module.scss';

export interface AuthModalProps {
  toggleConfirmed: () => void;
  confirmedModal: boolean;
}

const OpenOrderModal: FC<AuthModalProps> = ({ confirmedModal, toggleConfirmed }) => {
  const router = useRouter();
  const returnToOrder = () => {
    toggleConfirmed()
    router.push('/delivery');
  }

  return (
    <Modal
      isOpen={confirmedModal}
      centered={true}
      unmountOnClose={false}
      toggle={toggleConfirmed}
      style={{ width: 450 }}
    >
      <ModalBody className={styles.modalBody}>
        <h5>Ви не можете додати новий товар до корзини, оскільки у Вас є оплачене, але не оформлене замовлення.</h5>
        <button onClick={returnToOrder} className={styles.button}>
          Оформити замовлення
        </button>
      </ModalBody>
    </Modal>
  );
};

export default OpenOrderModal;
