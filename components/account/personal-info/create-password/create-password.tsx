import { api } from 'api';
import { ResendMessageButton } from 'components/buttons/resend-message-btn';
import { UserContext } from 'components/context/user-context';
import React, { FC, useContext, useState } from 'react';
import { Alert, Button, Popover, PopoverBody } from 'reactstrap';

import styles from './create-password.module.scss';

const CreatePassword: FC = () => {
  const { user } = useContext(UserContext);

  const [visible, setVisible] = useState(false);
  const onShow = () => setVisible(true);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverState, setPopoverState] = useState({
    message: 'Посилання на встановлення паролю вже відправлено Вам на пошту!',
  });
  const [isVisibleResend, setVisibleResend] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const togglePop = () => setPopoverOpen(!popoverOpen);

  const installPassword = async () => {
    const { data } = await api.user.requestPasswordInstall({
      email: user?.email!,
    });
    if (!data.success) {
      setPopoverState({ message: data.message });
      togglePop();
      setTimeout(() => {
        setPopoverOpen(false);
      }, 3000);
      
      return;
    }

    onShow();
    
    if (!isVisibleResend) {
      setVisibleResend(true);
      
      return;
    }

    setIsTimer(true);
  };

  return (
    <div>
      <Alert color="success" isOpen={visible}>
        <h6>Лист з посиланням на встановлення паролю відправлено Вам на пошту!</h6>
      </Alert>
      <p className={styles.text}>
        На жаль, функція зміни паролю Вам недоступна, оскільки Ви реєструвались через соціальну
        мережу або швидке замовлення, проте Ви можете його встановити:
      </p>
      <Popover placement="top" isOpen={popoverOpen} target="Popover">
        <PopoverBody>{popoverState.message}</PopoverBody>
      </Popover>
      {!isVisibleResend ? (
        <Button id="Popover" type="button" color="primary" onClick={installPassword}>
          Встановити пароль
        </Button>
      ) : (
        <ResendMessageButton
          isTimer={isTimer}
          title="Надіслати лист ще раз"
          action={() => setIsTimer(false)}
          submit={installPassword}
          type="submit"
          spinnerColor="light"
        ></ResendMessageButton>
      )}
    </div>
  );
};
export default CreatePassword;
