import React, { FC } from 'react';
import { ImSpinner10 } from 'react-icons/im';
import classNames from 'classnames';

import styles from './loader.module.scss';

interface LoaderProps {
  loadMore: () => void;
  isLoading: boolean;
  disableBtn?: boolean;
}

const Loader: FC<LoaderProps> = ({ loadMore, isLoading, disableBtn }) => {
  return (
    <>
      {!disableBtn && (
        <div className={styles.container}>
          <button
            onClick={loadMore}
            className={classNames(styles.btn, { [styles.animated]: isLoading })}
            disabled={disableBtn}
          >
            <div className={styles.icon}>
              <ImSpinner10 size={25} />
            </div>
            <span className={styles.text}>Показати ще</span>
          </button>
        </div>
      )}
    </>
  );
};

export default Loader;
