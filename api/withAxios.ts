import { FC, useContext, useMemo } from 'react';
import { UserContext } from '../components/context/user-context';
import instance from './axios-interceptors';
import { removeToken, removeUser } from '../services/local-storage-controller';

interface WithAxiosProps {
  children: any;
}

const WithAxios: FC<WithAxiosProps> = ({ children }) => {
  const { setGlobalUser } = useContext(UserContext);

  useMemo(() => {
    instance.interceptors.response.use(
      (res) => res,
      async (err) => {
        switch (err.response.status) {
          case 400: {
            return {
              error: {
                message: err.response.data.message,
              },
            };
          }
          case 401: {
            removeToken();
            removeUser();
            setGlobalUser(null);
            return {
              error: {
                message: err.response.data.message,
                statusCode: err.response.data.statusCode,
              },
            };
          }
          case 406: {
            removeToken();
            removeUser();
            setGlobalUser(null);
            return {
              error: {
                message: err.response.data.message,
                statusCode: err.response.data.statusCode,
              },
            };
          }
          case 409: {
            return {
              error: {
                message: err.response.data.message,
                statusCode: err.response.data.statusCode,
              },
            };
          }
          default: {
            return {
              error: {
                message: err.response.data.message,
              },
            };
          }
        }
      }
    );
  }, [setGlobalUser]);

  return children;
};

export default WithAxios;
