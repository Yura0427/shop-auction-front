import { useContext, useEffect, useState } from 'react';

import { api } from 'api';
import { getLSLikedProduct, setLsLikedProduct } from 'services/local-storage-controller';
import { IGetLikeResponse } from 'interfaces/like';
import { IProduct } from 'interfaces/product/products';
import { UserContext } from '../../components/context/user-context';

export const useProductLike = (products: IProduct[] = [], productId?: number) => {
  const { user } = useContext(UserContext);
  const likedProduct = useState<IGetLikeResponse[]>([]);
  const allProductsId = products!.map((item) => item.id).join(',');

  const getLikeProduct = async () => {
    if (getLSLikedProduct()) {
      likedProduct[1](getLSLikedProduct());
    } else {
      const { data } = await api.likes.getLikeProduct(
        `id=${allProductsId ? allProductsId : productId}`
      );
      setLsLikedProduct(data);
      likedProduct[1](data);
    }
  };

  useEffect(() => {
    if (user) getLikeProduct();
  }, [user]);

  return likedProduct;
};
