import React, { FC, useContext, useEffect, useState } from 'react';
import { Header } from '../../Header/Header';
import Footer from '../../Footer/Footer';
import MainLayout from '../../layout/MainLayout';
import { useCategories } from '../../../hooks/useCategories';
import { Button, Spinner } from 'reactstrap';
import styles from './verifyAccount.module.scss';
import { useRouter } from 'next/router';
import { SuccessSvg } from '../../svgs/Success.svg';
import { setToken } from '../../../services/local-storage-controller';
import { UserContext } from '../../context/user-context';
import { verifyAccount } from '../../../services/auth-requests';
import { IPopoverState } from '../../../interfaces/user/auth';

const VerifyAccount: FC = () => {
  const [spinner, setSpinner] = useState(true);
  const [error, setErrorMessage] = useState<IPopoverState>({
    message: '',
    statusCode: 0,
  });
  const { allCategories } = useCategories();
  const { setGlobalUser } = useContext(UserContext);
  const router = useRouter();
  const { code: codeQuery, userId } = router.query;

  useEffect(() => {
    const changeConfirmed = async () => {
      setSpinner(true);
      const { data, error } = await verifyAccount(codeQuery, +userId);

      if (error) {
        setSpinner(false);
        return setErrorMessage({ ...error });
      }

      const { token, user } = data;
      setSpinner(false);
      setGlobalUser(user);
      setToken(token);
    };

    if (codeQuery) {
      changeConfirmed();
    }
  }, [codeQuery]);

  const metaData = {
    title: 'Завершення реєстрації',
    description: 'Сторінка завершення реєстрації',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <Header categories={allCategories!} />
      <div className={styles.container}>
        {spinner ? (
          <Spinner type="grow" color="success" />
        ) : (
          <div className={styles.successMessage}>
            {!error.message ? (
              <>
                <div>
                  <SuccessSvg />
                  &nbsp; Вітаємо, реєстрація успішно завершена!!!
                </div>
                <Button
                  onClick={() => {
                    router.push('/');
                  }}
                  className={styles.button}
                >
                  На головну
                </Button>
              </>
            ) : (
              <div>{error.message}</div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </MainLayout>
  );
};

export default VerifyAccount;
