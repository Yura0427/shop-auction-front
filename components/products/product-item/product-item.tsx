import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Col, Spinner } from 'reactstrap';
import classNames from 'classnames';
import parse from 'html-react-parser';
import { MdRemoveShoppingCart } from 'react-icons/md';

import style from './product-item.module.scss';
import ProductImage from './product-image';
import { UseProductsInCart } from '../../../hooks/cart/useProductsInCart';
import { CartSvg } from '../../svgs/Cart.svg';
import { IProduct } from '../../../interfaces/product/products';
import { UserContext } from '../../context/user-context';
import StarRating from '../../star-rating/star-rating';
import FavoriteIcon from '../../account/favorite/favorite-icon';
import { useCartLogic } from '../../../hooks/cart/useCartLogic';
import { UtilsContext } from '../../context/utils-context';
import Route from '../../route/Route';
import ProductSelect from './product-select';
import { SelectActionType } from '../../../enums/selectActionType';
import { SizeContext } from '../../context/sizes-context';
import { IGetLikeResponse } from 'interfaces/like';
import { useColors } from '../../../hooks/products/useColors';
import OpenOrderModal from '@modals/openOrder/OpenOrderModal';
import { SnackBarContext } from '../../context/snackBar-context';

interface ProductProps {
  product: IProduct;
  customClass?: string;
  disableColorSize?: boolean;
  likedProduct: [IGetLikeResponse[], Dispatch<SetStateAction<IGetLikeResponse[]>>];
}

const ProductItem: FC<ProductProps> = ({
  product,
  customClass,
  disableColorSize,
  likedProduct,
}) => {
  const { user } = useContext(UserContext);
  const { setCartOpen } = useContext(UtilsContext);
  const { id } = product;
  const { mutate, productsInCart, data: order } = UseProductsInCart();

  const [buttonBuy, disabledButtonBuy] = useState(false);
  const [isCurrentColor, setIsCurrentColor] = useState('');
  const [isCurrentSize, setIsCurrentSize] = useState('');
  const commentsCount = product?.comments?.length;
  const currentColors = useColors([product]);
  const [confirmedModal, setConfirmedModal] = useState(false);
  const toggleConfirmed = () => setConfirmedModal(!confirmedModal);
  const { showSnackBar } = useContext(SnackBarContext);

  const { addProductInCart } = useCartLogic(product, user, mutate, order!, disabledButtonBuy);
  const [findedProductInCart, setFindedProductInCart] = useState(false);

  useEffect(() => {
    let isProductInCart: boolean | undefined = false;

    if (isCurrentColor && isCurrentSize) {
      isProductInCart = productsInCart?.some(
        ({ product, size, color }) =>
          product.id === id && size === isCurrentSize && color === isCurrentColor
      );
    } else if (isCurrentSize) {
      isProductInCart = productsInCart?.some(
        ({ product, size }) => product.id === id && size === isCurrentSize
      );
    } else if (isCurrentColor) {
      isProductInCart = productsInCart?.some(
        ({ product, color }) => product.id === id && color === isCurrentColor
      );
    } else {
      isProductInCart = productsInCart?.some(({ product }) => product.id === id);
    }

    setFindedProductInCart(Boolean(isProductInCart));
  }, [productsInCart, isCurrentColor, isCurrentSize]);

  const [colorSizeInCart, setColorSizeInCart] = useState({
    firstColor: '',
    firstSize: '',
  });

  useEffect(() => {
    setColorSizeInCart(() => {
      const productColor = productsInCart?.find(({ product, color }) => product.id === id && color);
      const productSize = productsInCart?.find(({ product, size }) => product.id === id && size);
      return { firstColor: productColor?.color || '', firstSize: productSize?.size || '' };
    });
  }, [productsInCart?.length]);

  const addProduct = () => {
    if (order?.liqpayPaymentStatus === 'success' && user) {
      setConfirmedModal(!confirmedModal);
    } else {
      showSnackBar('Товар доданий до корзини', true);
      addProductInCart({ isCurrentColor, isCurrentSize });
    }
  };

  const styleIconCart = {
    color: '#ffffff',
    height: 28,
    width: 58,
  };

  const baseUrl = product.url;
  const openCartModal = () => setCartOpen(true);

  return (
    <Col className={!customClass ? style.col : `${style.col} ${customClass}`}>
      <div>
        <OpenOrderModal confirmedModal={confirmedModal} toggleConfirmed={toggleConfirmed} />
      </div>
      <Card className={style.card}>
        {user ? <FavoriteIcon productId={id} likedProduct={likedProduct} /> : null}
        <Route href={`${baseUrl}/${product.key}`}>
          <ProductImage relatedProduct={product} isTitleShown={false} />
        </Route>
        <CardBody className={style.body}>
          <CardTitle tag="h6" className={style.title}>
            <Route href={`${baseUrl}/${product.key}`} linkClass={style.title}>
              {parse(product.name)}
            </Route>
          </CardTitle>
          <div className={style.card_price_block}>
            <StarRating relatedProduct={product} />
            <CardSubtitle tag="div" className={`mb-2 text-muted ${style.subTitle}`}>
              <Route href={`${baseUrl}/${product.key}?tab=reviews`}>
                <>
                  {commentsCount !== undefined ? (
                    `${commentsCount} відгуки`
                  ) : (
                    <Spinner size="sm" color="primary" />
                  )}
                </>
              </Route>
              {product.discountedPrice ? (
                <div className={style.priceRow}>
                  <p className={style.oldPrice}>{product.price} грн</p>
                  <p className={style.discountedPrice}>{product.discountedPrice} грн</p>
                </div>
              ) : (
                <div className={style.priceRow}>
                  <span className={style.price}>{product.price} </span>
                  грн
                </div>
              )}
            </CardSubtitle>
          </div>
          <div
            className={
              isCurrentColor && isCurrentColor !== 'common'
                ? style.selectBlock
                : style.selectBlock_noColor
            }
          >
            <SizeContext.Provider
              value={{ isCurrentColor, setIsCurrentColor, isCurrentSize, setIsCurrentSize }}
            >
              <ProductSelect
                action={SelectActionType.color}
                productId={product.id}
                characteristicsValue={product.characteristicValue}
                disableColorSize={disableColorSize}
                colorSizeInCart={colorSizeInCart}
                currentColors={currentColors}
              />
              <ProductSelect
                action={SelectActionType.size}
                productId={product.id}
                characteristicsValue={product.characteristicValue}
                disableColorSize={disableColorSize}
                colorSizeInCart={colorSizeInCart}
              />
            </SizeContext.Provider>
          </div>
          <div className={style.desc}>
            {!product.availability && (
              <p className={style.notAvailable}>
                <MdRemoveShoppingCart size={14} />
                "Немає в наявності"
              </p>
            )}
            {/*<CardText>*/}
            {/*  {product.description*/}
            {/*    ? parse(product.description.slice(0, 100) + ' ...')*/}
            {/*    : 'Опис товару відсутній'}*/}
            {/*</CardText>*/}
          </div>
          {!findedProductInCart ? (
            <Button
              disabled={buttonBuy || !product.availability}
              onClick={addProduct}
              className={classNames(style.btn, {
                [style.disabled]: !product.availability,
              })}
            >
              {buttonBuy ? <Spinner type="grow" color="success" /> : <>Купити</>}
            </Button>
          ) : (
            <Button onClick={openCartModal} className={classNames(style.btn, style.btn_cart)}>
              <CartSvg {...styleIconCart} />
            </Button>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default ProductItem;
