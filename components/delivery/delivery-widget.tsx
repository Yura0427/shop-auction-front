import React, {
  ChangeEvent,
  SyntheticEvent,
  FC,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  Form,
  Input,
  FormGroup,
  Button,
  Label,
  FormFeedback,
  Row,
  Col,
  Popover,
  PopoverBody,
} from 'reactstrap';
import Select from 'react-select';

import styles from './delivery.module.scss';
import { ICity, ISetCity, ISetStreet, IStreet } from '../../interfaces/delivery/delivery';
import { DeliveryMethods, PaymentMethods } from '../../enums/order';
import { api } from '../../api';
import { UserContext } from '../context/user-context';
import { IUser } from '../../interfaces/user/userData';
import LiqpayForm from '@forms/liqpay/liqpay';
import { IOrder, UseProductsInCart } from '../../hooks/cart/useProductsInCart';
import { formAndGetData, formAndGetJsonString, formAndGetSignature } from 'utils/liqpay';
import { IPopoverState } from '../../interfaces/user/auth';
import { SuccessSvg } from 'components/svgs/Success.svg';
import { LiqpayStatus } from 'enums/liqpay';
import { EAuthTabs } from '../../interfaces/modal';
import { LoginTab } from '../../components/context/login-tab';
import { mutate } from 'swr';
import {useRouter} from "next/router";

interface DeliveryWidgetProps {
  streets: IStreet[];
  cities: ICity[];
  setSelectCity: (arg: ISetCity) => void;
  selectCity: any;
  setSelectStreet: (arg: ISetStreet) => void;
  selectStreet: any;
  changeInputCity: (arg: string) => void;
  getCities: (arg: number) => void;
  defaultList: boolean;
  formik: any;
  cartData: IOrder | undefined;
  activeTab?: number;
  paymentStatus?: string;
  goToLiqpay: boolean;
}

const DeliveryWidget: FC<DeliveryWidgetProps> = ({
  formik,
  streets,
  cities,
  setSelectCity,
  selectCity,
  setSelectStreet,
  selectStreet,
  changeInputCity,
  getCities,
  defaultList,
  cartData,
  activeTab,
  paymentStatus,
  goToLiqpay,
}) => {
  const { user } = useContext(UserContext);
  const [citiesPage, setCitiesPage] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<IPopoverState>();
  const togglePop = () => setPopoverOpen(!popoverOpen);
  const { currentTab } = useContext(LoginTab);
  const [isShowButtonOrder, setIsShowButtonOrder] = useState(false);
  const [isShowRadioPostPay, setIsShowRadioPostPay] = useState<boolean>(true);
  const router = useRouter()
  const { productsInCart } = UseProductsInCart();

  if (user && !!!cartData?.id) {
    mutate('/orders/cart');
    if (!isShowButtonOrder) {
      setIsShowButtonOrder(true);
    }
  }

  const liqpayData = useMemo(
    () =>
      cartData?.orderIdForLiqpay
        ? formAndGetData(
            formAndGetJsonString(
              'pay',
              cartData?.amount,
              'UAH',
              'Order payment',
              cartData?.orderIdForLiqpay
            )
          )
        : '',
    [user, cartData]
  );

  const liqpaySignature = useMemo(
    () =>
      cartData?.orderIdForLiqpay
        ? formAndGetSignature(
            process.env.NEXT_PUBLIC_REACT_APP_PRIVATE_KEY_LIQPAY +
              liqpayData +
              process.env.NEXT_PUBLIC_REACT_APP_PRIVATE_KEY_LIQPAY
          )
        : '',
    [user, cartData]
  );

  const defaultCities =
    cities &&
    cities.map((item) => ({
      value: `${item.Description}, ${item.AreaDescription}`,
      label: `${item.Description}, ${item.AreaDescription}`,
      MainDescription: item.Description,
      DeliveryCity: item.Ref,
      Area: item.Area,
    }));

  const optionsCity =
    cities &&
    cities.map((item) => ({
      value: item.Present,
      label: item.Present,
      MainDescription: item.MainDescription,
      DeliveryCity: item.DeliveryCity,
      Area: item.Area,
    }));

  const optionsDelivery = [{ value: 'Нова Пошта', label: 'Нова Пошта' }];

  const optionsStreet =
    streets &&
    streets.map((item) => ({
      value: item.Description,
      label: item.Description,
      Ref: item.Ref,
    }));

  useEffect(() => {
    const getProfile = async (user: IUser | null = null) => {
      if (!user) {
        const profile = await api.user.getUser();
        setSelectCity({
          Area: profile?.data?.delivery?.areaName || '',
          DeliveryCity: profile?.data?.delivery?.cityRef || '',
          MainDescription: profile?.data?.delivery?.cityName || '',
          value: profile?.data?.delivery?.cityFullName || '',
          label: profile?.data?.delivery?.cityFullName || '',
        });
      }
    };

    getProfile(user);
  }, [user]);

  useEffect(() => {
    if(router.pathname === '/delivery' && user) {
      formik.initialValues.firstName = user?.firstName
      formik.initialValues.lastName = user?.lastName
      formik.initialValues.phoneNumber = user?.phoneNumber
      formik.initialValues.email = user?.email
    }
  }, [user]);

  useEffect(() => {
    getCities(citiesPage);
  }, [citiesPage]);

  useEffect(() => {
    if (formik.values?.deliveryMethod === DeliveryMethods.courier) {
      const deliveryValuesLS =
        typeof window !== 'undefined' && localStorage.getItem('deliveryValues');
      const deliveryValues = deliveryValuesLS && JSON.parse(deliveryValuesLS);
      formik.setFieldValue('courierDeliveryAddress', deliveryValues.courierDeliveryAddress);
      formik.setTouched({ ...formik.touched, ['courierDeliveryAddress']: false }, false);
    }
  }, [formik.values?.deliveryMethod]);

  const deliveryFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user && activeTab === 1) {
      setPopoverState({ message: 'Необхідно авторизуватись' });
      togglePop();
      setTimeout(() => {
        setPopoverOpen(false);
      }, 5000);
      return;
    }
    formik.handleSubmit();
  };

  const handleScroll = (e: SyntheticEvent<HTMLElement, Event>): void => {
    const target = e.target as HTMLElement;
    if (cities?.length) {
      const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
      if (bottom) {
        setCitiesPage((prev) => prev + 1);
      }
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: '1px solid #e2e6e7',
      height: '50px',
      borderRadius: '60px',
      color: '#495057',
      valueContainer: () => ({
        paddingLeft: '10px',
        height: '30px',
        input: () => ({
          height: '30px',
        }),
        singleValue: () => ({
          position: 'absolute',
          paddingRight: '50px',
          marginLeft: '2px',
          marginRight: '2px',
          maxWidth: 'calc(100% - 8px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          top: '50%',
          transform: 'translateY(-50%)',
        }),
      }),
    }),
  };

  useEffect(() => {
    if (currentTab === EAuthTabs.fastOrder || user) {
      setIsShowButtonOrder(true);
    } else {
      setIsShowButtonOrder(false);
    }
  }, [currentTab, user]);

  useEffect(() => {
    productsInCart?.forEach((order) => {
      if (order.product.shopKey === 'olla') setIsShowRadioPostPay(false);
    });
  }, []);

  return (
    <div className={styles['delivery_widget']}>
      <Form onSubmit={deliveryFormSubmit} className={styles['delivery_form']}>
        {user && (
          <>
            <div className={styles.control}>
              <FormGroup className={styles['delivery_change']}>
                <Select
                  type="input"
                  id="selectDelivery"
                  name="selectDelivery"
                  isSearchable={false}
                  options={optionsDelivery}
                  className={styles.input_mask}
                  styles={customStyles}
                  defaultValue={{ label: 'Нова Пошта', value: 'Нова Пошта' }}
                />
                <span className={styles.np_icon}></span>
              </FormGroup>
            </div>
            <FormGroup>
              <Select
                onMenuScrollToBottom={(e) => handleScroll(e)}
                id="selectCity"
                instanceId="selectCity"
                name="selectCity"
                styles={customStyles}
                options={defaultList ? defaultCities : optionsCity}
                defaultValue={selectCity}
                value={selectCity?.value ? selectCity : 'Введіть назву міста'}
                onInputChange={(value) => changeInputCity(value)}
                placeholder="Введіть назву міста"
                onChange={setSelectCity}
                onFocus={() => {
                  !cities?.length && getCities(citiesPage);
                }}
                onBlur={() => {
                  setCitiesPage(1);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Select
                id="selectStreet"
                instanceId="selectStreet"
                name="selectStreet"
                styles={customStyles}
                options={optionsStreet}
                defaultValue={selectStreet}
                value={selectStreet?.value ? selectStreet : 'Введіть назву вулиці'}
                placeholder="Введіть назву вулиці"
                onChange={setSelectStreet}
              />
            </FormGroup>
            <FormGroup className={styles['delivery_methods-block']}>
              <legend>Оберіть спосіб доставки</legend>
              <Row className="justify-content-start ml-4">
                <Col lg={5}>
                  <Input
                    type="radio"
                    id={DeliveryMethods.courier}
                    name="deliveryMethod"
                    value={DeliveryMethods.courier}
                    checked={formik.values?.deliveryMethod === DeliveryMethods.courier}
                    onChange={formik.handleChange}
                  />
                  <Label htmlFor={DeliveryMethods.courier}>Кур'єрська доставка</Label>
                </Col>
                <Col lg={5}>
                  <Input
                    type="radio"
                    id={DeliveryMethods.selfPickup}
                    name="deliveryMethod"
                    value={DeliveryMethods.selfPickup}
                    checked={formik.values?.deliveryMethod === DeliveryMethods.selfPickup}
                    onChange={formik.handleChange}
                  />
                  <Label htmlFor={DeliveryMethods.selfPickup}>Самовивіз</Label>
                </Col>
              </Row>
              <FormFeedback
                className={
                  formik.errors.deliveryMethod && formik.touched.deliveryMethod ? 'd-block' : ''
                }
              >
                {formik.errors.deliveryMethod}
              </FormFeedback>
            </FormGroup>
            {formik.values?.deliveryMethod === DeliveryMethods.courier && (
              <FormGroup className={styles['delivery_courier-delivery-address']}>
                <Input
                  type="text"
                  name="courierDeliveryAddress"
                  id="courierDeliveryAddress"
                  placeholder="Адреса для кур&#39;єрської доставки"
                  value={formik.values.courierDeliveryAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    !!(
                      formik.values?.deliveryMethod === DeliveryMethods.courier &&
                      formik.errors.courierDeliveryAddress &&
                      formik.touched.courierDeliveryAddress
                    )
                  }
                />
                <FormFeedback>{formik.errors.courierDeliveryAddress}</FormFeedback>
              </FormGroup>
            )}
            <FormGroup className={styles['delivery_comment-block']}>
              <Label for="comment">Коментар до замовлення</Label>
              <Input
                type="textarea"
                name="comment"
                id="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ви можете залишити коментар до Вашого замовлення..."
                invalid={!!(formik.errors.comment && formik.touched.comment)}
              />
              <FormFeedback>{formik.errors.comment}</FormFeedback>
            </FormGroup>
            <FormGroup className={styles['delivery_methods-block']}>
              {paymentStatus !== LiqpayStatus.success && (
                <>
                  <legend>Оберіть спосіб оплати </legend>
                  <Row className="justify-content-start ml-4">
                    <Col lg={5}>
                      <Input
                        type="radio"
                        id={PaymentMethods.liqPay}
                        name="paymentMethod"
                        value={PaymentMethods.liqPay}
                        checked={formik.values.paymentMethod === PaymentMethods.liqPay}
                        onChange={formik.handleChange}
                      />
                      <Label htmlFor={PaymentMethods.liqPay}>LiqPay</Label>
                    </Col>
                    {isShowRadioPostPay && (
                      <Col lg={5}>
                        <Input
                          type="radio"
                          id={PaymentMethods.postPay}
                          name="paymentMethod"
                          value={PaymentMethods.postPay}
                          checked={formik.values.paymentMethod === PaymentMethods.postPay}
                          onChange={formik.handleChange}
                        />
                        <Label htmlFor={PaymentMethods.postPay}>Післяплата</Label>
                      </Col>
                    )}
                  </Row>
                </>
              )}
              {paymentStatus && (
                <div
                  style={{
                    background: '#d4edda',
                    display: 'flex',
                    justifyContent: 'center',
                    height: 45,
                    padding: '10px 0',
                    borderRadius: '25px',
                  }}
                >
                  {paymentStatus === LiqpayStatus.success ? (
                    <>
                      Дякуємо! Оплата пройшла успішно.
                      <SuccessSvg />
                    </>
                  ) : (
                    <>Платіж не проведено</>
                  )}
                </div>
              )}
              <FormFeedback
                className={
                  formik.errors.paymentMethod && formik.touched.paymentMethod ? 'd-block' : ''
                }
              >
                {formik.errors.paymentMethod}
              </FormFeedback>
            </FormGroup>
          </>
        )}
        {isShowButtonOrder && (
          <>
            <Popover placement="top" isOpen={popoverOpen} target="fastOrderPop">
              <PopoverBody>{popoverState?.message}</PopoverBody>
            </Popover>
            <Button
              id="fastOrderPop"
              className={styles['delivery_btnSubmit']}
              type="submit"
              disabled={formik.isSubmitting}
            >
              {user ? 'Оформити замовлення' : 'Оформлення замовлення'}
            </Button>
          </>
        )}
        {goToLiqpay ? (
          <LiqpayForm
            data={liqpayData}
            signature={liqpaySignature}
            amount={cartData?.amount}
            width="100%"
            height="1px"
            borderRadius="60px"
            margin="0 0 0 0"
            goToLiqpay={goToLiqpay}
          />
        ) : null}
      </Form>
    </div>
  );
};

export default DeliveryWidget;
