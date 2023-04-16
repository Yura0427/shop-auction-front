import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/swiper-bundle.min.css';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import '../styles/index.scss';
import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { AxiosResponse } from 'axios';
import TagManager from 'react-gtm-module';
import io from 'socket.io-client';

import { useStore } from '../store';
import { UserContext } from '../components/context/user-context';
import { UtilsContext } from '../components/context/utils-context';
import { getUser, setUser } from '../services/local-storage-controller';
import { IUser } from '../interfaces/user/userData';
import instance from '../api/axios-interceptors';
import WithAxios from '../api/withAxios';
import SnackBar from '../components/common/SnackBar';
import FeedbackMenu from '../components/FeedbackMenu/FeedbackMenu';
import { SnackBarContext } from 'components/context/snackBar-context';
import { SnackBarState } from '../interfaces/SnacBar';
import { useRouter } from 'next/router';
import { saga } from '../store/middleware';
import rootSaga from '../store/sagas/root.saga';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState);
  saga.run(rootSaga);

  const socket = io(process.env.NEXT_PUBLIC_REACT_APP_ROOT || 'http://localhost:4000', {
    reconnection: false,
    autoConnect: false,
  });

  const userFromLS = getUser();
  const [user, setLocalUser] = useState<IUser | null>(userFromLS);
  const [cartOpen, setCartOpen] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit('newConnection');
  }, []);

  const setGlobalUser = (user: IUser) => {
    setLocalUser(user);
    setUser(user);
  };

  const [snackBarState, changeSnackBarState] = useState<SnackBarState>({
    visible: false,
    success: false,
    message: '',
    timeout: undefined,
  });

  const showSnackBar = (message: string, success: boolean) => {
    clearTimeout(snackBarState.timeout);

    changeSnackBarState((prevState) => ({ ...prevState, visible: true, success, message }));
    const timeout = setTimeout(() => {
      changeSnackBarState((prevState) => ({ ...prevState, visible: false }));
    }, 4000);
    changeSnackBarState((prevState) => ({ ...prevState, timeout }));
  };

  const router = useRouter();
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GTAG_ID !== 'none') {
      const handleRouteChange = (url: any) => {
        window.gtag('config', `${process.env.NEXT_PUBLIC_GTAG_ID}`, {
          page_path: url,
        });
      };
      router.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);

  useEffect(() => {
    process.env.NEXT_PUBLIC_GTAG_ID !== 'none' &&
      TagManager.initialize({ gtmId: `${process.env.NEXT_PUBLIC_GTM_ID}` });
  });

  return (
    <Provider store={store}>
      <UserContext.Provider value={{ user, setGlobalUser }}>
        <UtilsContext.Provider
          value={{
            feedbackOpen,
            feedbackVisible,
            setFeedbackOpen,
            setFeedbackVisible,
            cartOpen,
            setCartOpen,
          }}
        >
          <WithAxios>
            <NextNprogress color="gold" startPosition={0.3} stopDelayMs={200} height={2} />
            <SWRConfig
              value={{
                revalidateOnFocus: false,
                fetcher: async (url: string): Promise<AxiosResponse> =>
                  instance.get(url).then((res) => res.data),
              }}
            >
              <SnackBarContext.Provider value={{ showSnackBar: showSnackBar }}>
                <Component {...pageProps} />
                <FeedbackMenu />
              </SnackBarContext.Provider>
              {snackBarState.visible ? (
                <SnackBar success={snackBarState.success} message={snackBarState.message} />
              ) : null}
            </SWRConfig>
          </WithAxios>
        </UtilsContext.Provider>
      </UserContext.Provider>
    </Provider>
  );
};

export default App;
