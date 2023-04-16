import { FC, useEffect, useState } from 'react';
import { api } from '../../api/index';
import { IUser } from '../../interfaces/user/userData';
import styles from './draw-list.module.scss';

const DrawList: FC = () => {
  const [winners, setWinners] = useState<IUser[]>();

  useEffect(() => {
    let isLoaded = true;
    api.user.getRegistredUsers().then(({ data }) => {
      if (isLoaded) {
        if (data) {
          setWinners(data);
        }
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);

  const dateFormatter = (winnerDate: Date | undefined): string => {
    if (!winnerDate) return '';
    const date = new Date(winnerDate);
    return date.toLocaleDateString();
  };

  return (
    <div className={styles['winners_wrapper']}>
      <ul className="">
        {winners?.length && (
          <li className={styles['winners_title']}>
            <h2>Переможці розіграшу:</h2>
          </li>
        )}
        {winners?.length ? (
          winners.map((winner) => (
            <li key={winner.id} className={styles['winners_item']}>
              <span className={styles['winners_text']}>
                {winner.firstName} {winner.lastName}
              </span>
              <span>розіграш відбувся {dateFormatter(winner.winnerDate)}</span>
            </li>
          ))
        ) : (
          <li>
            <p className={styles['winners_title']}>Чекаємо на розіграш!</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default DrawList;
