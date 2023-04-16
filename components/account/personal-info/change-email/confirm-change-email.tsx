import React, { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../../context/user-context';
import { Button, Alert } from 'reactstrap';

import { api } from '../../../../api';
import { setToken } from '../../../../services/local-storage-controller';
import MainLayout from '../../../layout/MainLayout';
import { Header } from '../../../Header/Header';
import Footer from '../../../Footer/Footer';
import { useCategories } from '../../../../hooks/useCategories';
import styles from './confirm-change-email.module.scss';

export const ConfirmChangeEmail: FC = () => {
  const router = useRouter();

  const { code: codeQuery, userId, email } = router.query;

  const { setGlobalUser } = useContext(UserContext);
  const { allCategories } = useCategories();

  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggleAlert = () => setAlertOpen(!alertOpen);

  useEffect(() => {
    if (!router.isReady) return;

    async function changeEmail() {
      const userData = {
        userId: +userId,
        token: codeQuery as string,
        email: email as string,
      };
      const { error, data } = await api.user.changeEmail(userData);
      if (error) {
        setError(error.message);
        toggleAlert();
        setTimeout(() => {
          setAlertOpen(false);
          router.push('/');
        }, 5000);
      } else {
        const { token, user } = data;
        setGlobalUser(user);
        setToken(token);
      }
    }

    changeEmail();
  }, [router.isReady]);

  const metaData = {
    title: 'Підтвердження зміни пошти',
    description: 'Сторінка підтвердження зміни пошти',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <Header categories={allCategories!} />
      <div className={styles.container}>
        <div className={styles.successMessage}>
          {error ? (
            <Alert color="danger" isOpen={alertOpen}>
              {error}
            </Alert>
          ) : (
            <>
              <h3>Email успішно змінений</h3>
              <h5>Лист з підтвердженням відправлений вам на пошту</h5>
            </>
          )}

          <Button
            onClick={() => {
              router.push('/');
            }}
            className={styles.button}
          >
            На головну
          </Button>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
};
