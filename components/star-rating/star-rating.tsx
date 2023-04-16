import React, { FC, useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { Spinner } from 'reactstrap';

import styles from './star-rating.module.scss';
import { UserContext } from '../context/user-context';
import { useProduct } from '../../hooks/products/useProduct';
import { api } from '../../api';
import { IProduct } from '../../interfaces/product/products';
import { SnackBarContext } from 'components/context/snackBar-context';



interface StarRatingProps {
  relatedProduct: IProduct;
  displayOnly?: boolean;
}

const StarRating: FC<StarRatingProps> = ({ relatedProduct, displayOnly }) => {
  const { user } = useContext(UserContext);
  const { data, avgRating, mutate } = useProduct(relatedProduct.key!, relatedProduct);
  const [isLoading, setIsLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { showSnackBar } = useContext(SnackBarContext);

  useEffect(() => {
    user && !displayOnly ? setHovered(true) : setHovered(false);
  }, [user]);

  const starGenerate = new Array(5).fill(null);
  const size = (+avgRating! * 100) / 5;

  const handleClick = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!user) {

      showSnackBar(`Щоб оцінити товар потрібно Увійти або Зареєструватися`, true);
      return;
    }


    setIsLoaded(true);
    const newRating = e.currentTarget.dataset.rate || 0;

    if (user) {
      const rating = await api.ratings.addRating({
        productId: relatedProduct.id,
        currentRating: +newRating,
      });

      await mutate({
        ...data!,
        avgRating: rating.data.avgRating,
      });
    }
    setIsLoaded(false);
  };

  return (
    <div className={styles.ratingBlock}>
      <div className={styles.rating}>
        <div className={styles.stars}>
          <div className={styles.on} style={{ width: `${size}%` }} />
          <div className={cx(styles.live, { [styles.hovered]: hovered })}>
            {starGenerate.map((item, index) => {
              return (
                <span
                  key={item + index}
                  data-rate={index + 1}
                  onClick={!displayOnly ? handleClick : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>
      <span className={styles.rating_title}>
        {isLoading ? <Spinner className={styles.spinner} size="sm" color="primary" /> : avgRating}
      </span>
    </div>
  );
};

export default StarRating;
