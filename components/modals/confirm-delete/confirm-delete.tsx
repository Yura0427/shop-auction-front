import React, { FC } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface IConfirmDelete {
  openModal: boolean;
  toggle: () => void;
  handleDelete: () => void;
  title?: string;
  text?: string;
  btnTitle?: string;
}

const ConfirmDelete: FC<IConfirmDelete> = ({
  openModal,
  toggle,
  handleDelete,
  title = 'Підтвердіть видалення',
  text = 'Видалені дані буде неможливо відновити',
  btnTitle = 'Видалити',
}) => {
  const onDeleteClick = () => {
    handleDelete();
    toggle();
  };

  return (
    <Modal isOpen={openModal} toggle={toggle}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{text}</ModalBody>
      <ModalFooter style={{ borderTop: 'none' }}>
        <Button color="primary" onClick={onDeleteClick}>
          {btnTitle}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Закрити
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDelete;
