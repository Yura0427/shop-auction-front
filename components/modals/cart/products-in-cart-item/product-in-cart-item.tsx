import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';
import { IoMdArrowDropupCircle, IoMdArrowDropdownCircle } from 'react-icons/io';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import style from './product-in-cart-item.module.scss';
import { DeletebuttonSvg } from '../../../svgs/DeleteButton.svg';
import { api } from '../../../../api';
import apiUrl from '../../../../api/config';
import { UseProductsInCart } from '../../../../hooks/cart/useProductsInCart';
import { useComments } from '../../../../hooks/useComments';
import { UserContext } from '../../../context/user-context';
import StarRating from '../../../star-rating/star-rating';
import Route from '../../../route/Route';
import { clearLsCart, getLSCart, setLsCart } from '../../../../services/local-storage-controller';
import { UtilsContext } from '../../../context/utils-context';
import { ProductToOrder } from '../../../../interfaces/product/products-in-cart';
import { getColorsPictures } from '../../../../utils/get-colors-pictures';
import { IColororsPictures } from '../../../../interfaces/colorsPictures.interface';
import { getColorPictureUrl } from '../../../../utils/get-color-picture-url';
import { SnackBarContext } from '../../../context/snackBar-context';

interface ProductsInCartProps {
  orderProduct: ProductToOrder;
}

const ProductInCartItem: FC<ProductsInCartProps> = ({ orderProduct }) => {
  const router = useRouter();
  const { product, quantity, amount, ...selected } = orderProduct;
  const { name, price, discountedPrice, mainImg } = product;
  const previewImg = mainImg
    ? `${apiUrl}/static/uploads/${mainImg.name}`
    : `${apiUrl}/static/uploads/empty-preview.png`;
  const alt = mainImg ? `Фото товару ${name} відсутнє` : `Фото товару ${name}`;
  const { commentsData } = useComments(product.id, 1);
  const commentCount = commentsData?.count;
  const { productsInCart, mutate, data: order, isLoading } = UseProductsInCart();
  const { user } = useContext(UserContext);
  const { setCartOpen } = useContext(UtilsContext);
  const [currentColors, setCurrentColors] = useState<IColororsPictures[]>([]);
  const { showSnackBar } = useContext(SnackBarContext);

  const deleteProductFromCart = async () => {
    const mutatedData = productsInCart
      ? [
          ...productsInCart.filter(
            (item) =>
              item.color !== orderProduct.color ||
              item.size !== orderProduct.size ||
              item.product.id !== orderProduct.product.id
          ),
        ]
      : [];

    await mutate({ ...order, productToOrder: mutatedData }, false);
    showSnackBar('Товар видаленний з корзини', false);
    if (user) {
      await api.productsInCart.deleteProductFromCart(product.id);
    } else {
      setLsCart(mutatedData);
      const cartStorage = getLSCart();

      if (!cartStorage.length) {
        clearLsCart();
      }
    }

    if (user && !isLoading && !order) {
      router.push('/');
    }
  };

  const colorSizeChecking = (products: ProductToOrder[]) => {
    const findProduct = products.filter(
      (productInOrder) =>
        productInOrder.product.id === orderProduct.product.id &&
        productInOrder.color === orderProduct.color &&
        productInOrder.size === orderProduct.size
    );

    if (findProduct) {
      return {
        color: findProduct[0].color ? findProduct[0].color : undefined,
        size: findProduct[0].size ? findProduct[0].size : undefined,
      };
    }
  };

  const incrementQuantityProductFromCart = async () => {
    const mutatedData = productsInCart
      ? [
          ...productsInCart.map((productInOrder) =>
            productInOrder.product.id === product.id &&
            productInOrder.color === orderProduct.color &&
            productInOrder.size === orderProduct.size
              ? {
                  ...productInOrder,
                  quantity: productInOrder.quantity + 1,
                  amount: discountedPrice
                    ? discountedPrice + discountedPrice * quantity
                    : price + price * quantity,
                }
              : productInOrder
          ),
        ]
      : [];

    const sizeAndColor = colorSizeChecking(mutatedData);
    await mutate({ ...order!, productToOrder: mutatedData }, false);

    if (user) {
      await api.productsInCart.updateProductFromCart(product.id, {
        quantity: quantity + 1,
        color: sizeAndColor?.color,
        size: sizeAndColor?.size,
        orderProductId: orderProduct.id,
      });
    } else {
      setLsCart(mutatedData);
    }
  };

  const decrementQuantityProductFromCart = async () => {
    if (quantity === 1) return;

    const mutatedData = productsInCart
      ? [
          ...productsInCart.map((productInOrder) =>
            productInOrder.product.id === product.id &&
            productInOrder.color === orderProduct.color &&
            productInOrder.size === orderProduct.size
              ? {
                  ...productInOrder,
                  quantity: productInOrder.quantity - 1,
                  amount: discountedPrice
                    ? discountedPrice * quantity - discountedPrice
                    : price * quantity - price,
                }
              : productInOrder
          ),
        ]
      : [];

    const sizeAndColor = colorSizeChecking(mutatedData);
    await mutate({ ...order!, productToOrder: mutatedData }, false);
    if (user) {
      await api.productsInCart.updateProductFromCart(product.id, {
        quantity: quantity - 1,
        color: sizeAndColor?.color,
        size: sizeAndColor?.size,
        orderProductId: orderProduct.id,
      });
    } else {
      setLsCart(mutatedData);
    }
  };

  const setQuantityProductFromCart = async (e: ChangeEvent<HTMLInputElement>) => {
    let quantity = +e.target.value;
    quantity < 1 || isNaN(quantity) ? (quantity = 1) : quantity;

    const mutatedData = productsInCart
      ? [
          ...productsInCart.map((productInOrder) =>
            productInOrder.product.id === product.id &&
            productInOrder.color === orderProduct.color &&
            productInOrder.size === orderProduct.size
              ? {
                  ...productInOrder,
                  quantity: quantity,
                  amount: discountedPrice ? discountedPrice * quantity : price * quantity,
                }
              : productInOrder
          ),
        ]
      : [];

    const sizeAndColor = colorSizeChecking(mutatedData);
    await mutate({ ...order!, productToOrder: mutatedData }, false);
    if (user) {
      await api.productsInCart.updateProductFromCart(product.id, {
        quantity,
        color: sizeAndColor?.color,
        size: sizeAndColor?.size,
        orderProductId: orderProduct.id,
      });
    } else {
      setLsCart(mutatedData);
    }
  };

  const baseUrl = product.url;

  useEffect(() => {
    let isLoaded = true;
    getColorsPictures({
      colorsNames: [(product.color as string) || (selected.color as string)],
    }).then((data) => {
      if (isLoaded) {
        setCurrentColors(data);
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);

  return (
    <div className={style.container}>
      <div className={style.productInCart}>
        <div className={style.productInCart__block}>
          <div className={style.productInCart__img}>
            <Image width={85} height={73} src={previewImg} alt={alt} />
          </div>
          <div className={style.productInCart__titleBlock}>
            <div className={style.titleBlock__name}>
              <Route href={`${baseUrl}/${product.key}`} onClick={() => setCartOpen(false)}>
                <span className={style.text}>{parse(name)}</span>
              </Route>
              <div className={style.titleBlock__params}>
                {(product.size || selected.size) && (
                  <span className={style.titleBlock__size}>
                    {selected.size ? selected.size : product.size}
                  </span>
                )}
                {(product.color || selected.color) && selected.color !== 'common' && (
                  <span
                    className={style.titleBlock__color}
                    style={{
                      background: getColorPictureUrl(
                        product.color! || selected.color!,
                        currentColors
                      ),
                    }}
                  />
                )}
              </div>
            </div>
            <div className={style.titleBlock__rating}>
              <Route
                href={`${baseUrl}/${product.key}?tab=reviews`}
                onClick={() => setCartOpen(false)}
              >
                {`${commentCount} відгуки`}
              </Route>
              <StarRating relatedProduct={product} />
            </div>
          </div>
        </div>
        <div className={style.productInCart__priceQuantityDelete}>
          <div className={style.productInCart__priceBlock}>
            {discountedPrice ? (
              <>
                <s className={style.productInCart__previousPrice}>{price} грн</s>
                <div className={style.productInCart__discountedPrice}>{discountedPrice} грн</div>
                {quantity > 1 && <div className={style.productInCart__amount}>{amount} грн</div>}
              </>
            ) : (
              <>
                <div className={style.productInCart__price}>{price} грн</div>
                {quantity > 1 && <div className={style.productInCart__amount}>{amount} грн</div>}
              </>
            )}
          </div>
          <div className={style.productInCart__plusMinusItem}>
            <button
              onClick={decrementQuantityProductFromCart}
              className={classNames(style.productInCart__minus, {
                [style.btnDisabled]: quantity === 1,
              })}
            >
              <IoMdArrowDropdownCircle size={25} />
            </button>
            <div>
              <input
                className={style.productInCart__quantity}
                value={quantity}
                onChange={setQuantityProductFromCart}
              />
            </div>
            <button
              onClick={incrementQuantityProductFromCart}
              className={style.productInCart__plus}
            >
              <IoMdArrowDropupCircle size={25} />
            </button>
          </div>
          <button className={style.productInCart__delete} onClick={deleteProductFromCart}>
            <DeletebuttonSvg />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInCartItem;
