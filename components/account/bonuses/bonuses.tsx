import { api } from '../../../api/index';
import { FC, useContext, useEffect } from 'react';
import { UserContext } from '../../context/user-context';

const Bonuses: FC = () => {
  const { user, setGlobalUser } = useContext(UserContext);

  useEffect(() => {
    let isLoaded = true;
    api.user.getUser().then(({ data }) => {
      if (isLoaded) {
        setGlobalUser(data);
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);

  return (
    <div>
      <h2>Бонуси</h2>
      <p style={{ fontSize: '1.1rem' }}>
        {user?.wafCoins
          ? `На Вашому бонусному рахунку ${user?.wafCoins} коінів`
          : 'На Вашому рахунку на даний момент відсутні бонусні накопичення'}
      </p>
    </div>
  );
};

export default Bonuses;
