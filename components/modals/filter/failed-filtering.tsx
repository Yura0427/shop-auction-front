import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import React, { FC, useContext } from 'react';
import { useRouter } from 'next/router';
import { IModalProps } from '../../../interfaces/modal';
import { LoadingContext } from '../../context/loading-context';

interface FailingModalProps extends IModalProps {
  mutate: () => void;
}

const FailedFilteringModal: FC<FailingModalProps> = ({ isOpen, toggle, mutate }) => {
  const router = useRouter();
  const baseURL = '/' + (router.query.slug as string[]).join('/');

  const { setLoading } = useContext(LoadingContext);

  const onClickHandler = async () => {
    setLoading(true);

    await router.push(baseURL);
    await mutate();
    toggle();

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Увага помилка</ModalHeader>
      <ModalBody>
        Вибачте, ви намагаєтесь встановити некорректні фільтри. Рекомендуємо встановити їх вручну
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClickHandler}>
          Згоден
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FailedFilteringModal;
