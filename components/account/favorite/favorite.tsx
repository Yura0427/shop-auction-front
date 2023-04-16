import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import parse from 'html-react-parser';

import styles from './favorite.module.scss';
import { Spinner } from 'reactstrap';
import { useLikes } from '../../../hooks/useLikes';
import { UserContext } from '../../context/user-context';
import { useRouter } from 'next/router';
import { LoadingContext } from '../../context/loading-context';
import { ILike } from '../../../interfaces/like';
import { EAccountUrls } from '../../../interfaces/account/account.enum';
import { api } from '../../../api';
import { Button } from 'reactstrap';
import PaginationBlock from '../../pagination/pagination-block';
import apiUrl from '../../../api/config';
import PriceBlock from '../../products/products-tabs/main-tab/price-block/price-block';
import ColorBlock from '../../products/products-tabs/main-tab/color-block/color-block';
import SizeBlock from '../../products/products-tabs/main-tab/size-block/size-block';

const Favorite: FC = () => {
  const { user } = useContext(UserContext);
  const { isLoading, setLoading } = useContext(LoadingContext);
  const router = useRouter();
  const queryPage = useMemo(() => router.query.page && Number(router.query.page), [router.query.page]);

  const [currentPage, setCurrentPage] = useState(queryPage || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [likes, setLikes] = useState<ILike[]>([]);
  const [likesError, setLikesError] = useState<boolean>(false);
  const [deleteLikeProduct, setDeleteLikeProduct] = useState(false);

  const likesResponse = user?.id && useLikes(user.id, currentPage);
  if (!likesResponse) return null;

  const { data: likesData, mutate, error } = likesResponse;

  const deleteFavorite = async (productId: number) => {
    setDeleteLikeProduct(!deleteLikeProduct);
    if (likes!.length === 1 && currentPage !== 1) {
      setCurrentPage(() => currentPage - 1);
    }
    return await api.likes.addLikeProduct(productId);
  };

  useEffect(() => {
    if (likesData) {
      setTotalPages(likesData.totalPages);
      setLikes(likesData.data);
      setLikesError(error);
    }
  }, [likesData]);

  const getLikes = async () => {
    setLoading(true);
    const response = await api.likes.getUserLikesProduct(user!.id, currentPage);
    if (!response) {
      setLikesError(true);
      return;
    }

    const newData = response.data?.data ? response.data.data : [];
    likesData && (await mutate({ ...likesData, data: newData }));
    setLoading(false);
  };

  useEffect(() => {
    queryPage === 1
      ? router.push(`/account/${EAccountUrls.favorite}`, undefined, { shallow: true })
      : router.push(`/account/${EAccountUrls.favorite}?page=${currentPage}`, undefined, {
          shallow: true,
        });

    getLikes();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage, deleteLikeProduct]);

  const resetError = () => {
    setCurrentPage(1);
    setLikesError(false);
  };
  return (
    <div className={styles.favorite__wrapper}>
      <h2 className={styles.favorite_title}>Мої вибрані товари</h2>
      {likesError && !user ? (
        <>
          <div className={styles.favorite_error}>
            <p>Такої сторінки не існує. Перейти на </p>
            <Button color="link" onClick={resetError} className={styles.favorite_btnLink}>
              першу сторінку
            </Button>
          </div>
        </>
      ) : likes?.length && totalPages ? (
        <>
          {isLoading ? (
            <span className={styles.favorite_spinner}>
              <Spinner style={{ width: '5rem', height: '5rem' }} color="success" />
            </span>
          ) : (
            <div>
              {likes.map((like) => {
                const { name, mainImg, key, url } = like.product;
                const productId = like.product.id;
                const previewImg = mainImg
                  ? `${apiUrl}/static/uploads/${mainImg.name}`
                  : `${apiUrl}/static/uploads/empty-preview.png`;
                const alt = !mainImg ? `Фото товару ${name} відсутнє` : `Фото товару ${name}`;

                return (
                  <div className={styles.favorite__wrapper_item} key={like.id}>
                    <div className={styles.favorite_block}>
                      <div className={styles.favorite_img}>
                        <img src={previewImg} alt={alt} />
                      </div>
                      <div className={styles.favorite_info}>
                        <Link href={`${url}/${key}`} key={like.id}>
                          <span className={styles.favorite_info_name}>{parse(name)}</span>
                        </Link>
                        <div className={styles.sizeColor}>
                          <ColorBlock
                            characteristicsValue={like.product.characteristicValue}
                            productId={like.product.id}
                          />
                          <SizeBlock
                            characteristicsValue={like.product.characteristicValue}
                            productId={like.product.id}
                          />
                        </div>
                      </div>
                    </div>
                    <PriceBlock relatedProduct={like.product} compact customClass={styles.priceBlock} />
                    <div className={styles.favorite_delete} onClick={() => deleteFavorite(productId)}>
                      <span>&#10006;</span>
                    </div>
                  </div>
                );
              })}
              <PaginationBlock
                routerPush={null}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
          )}
        </>
      ) : (
        <p style={{ fontSize: '1.1rem' }}>Ви ще не додали товари до вибраних</p>
      )}
    </div>
  );
};

export default Favorite;
