import React, { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import MainLayout from '../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import DeliveryWidget from '../components/delivery/delivery-widget';
import { api } from '../api';
import { UserContext } from '../components/context/user-context';
import { UseProductsInCart } from '../hooks/cart/useProductsInCart';
import { registerCutUser } from '../services/auth-requests';
import { setToken } from '../services/local-storage-controller';
import {
  IAddDelivery,
  ICity,
  ISetCity,
  ISetStreet,
  IStreet,
} from '../interfaces/delivery/delivery';
import { apiDelivery } from '../api/delivery';
import styles from '../components/delivery/delivery.module.scss';
import { useCategories } from '../hooks/useCategories';
import { Auth } from '../components/auth/Auth';
import { EAuthTabs } from '../interfaces/modal';
import { useCartReplace } from '../hooks/cart/useCartReplacer';
import { IPopoverState } from '../interfaces/user/auth';
import { IAdditionalOrderFields } from '../interfaces/order';
import { DeliveryMethods } from 'enums/order';
import { LoginTab } from '../components/context/login-tab';
import { socket } from 'utils/socket-io-requests';

const DeliveryPage: FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_REACT_APP_DELIVERY_API_KEY;
  const headerName = 'Для оплати товару увійдіть або зареєструйтесь';
  const activeTab = EAuthTabs.fastOrder;
  const [active, setActive] = useState(0);
  const fastOrder = true;

  const { productsInCart, mutate, data: cartData, isLoading } = UseProductsInCart();
  const { allCategories } = useCategories();

  const router = useRouter();
  const { user, setGlobalUser } = useContext(UserContext);
  const [confirmedModal, setConfirmedModal] = useState(false);
  const [goToLiqpay, isGoToLiqpay] = useState(false);
  const [defaultList, setDefaultList] = useState(true);
  const [visible, setVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<IPopoverState>({ message: '', statusCode: 0 });
  const [cities, setCities] = useState<ICity[]>([]);
  const [streets, setStreets] = useState<IStreet[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>();
  const [selectCity, setSelectCity] = useState<ISetCity>({
    Area: '',
    DeliveryCity: '',
    MainDescription: '',
    value: '',
    label: '',
  });
  const [selectStreet, setSelectStreet] = useState<ISetStreet>({
    value: '',
    label: '',
    Ref: '',
  });
  const deliveryValuesLS = typeof window !== 'undefined' && localStorage.getItem('deliveryValues');
  const deliveryValues = deliveryValuesLS && JSON.parse(deliveryValuesLS);
  const [currentTab, setCurrentTab] = useState(EAuthTabs.fastOrder);
  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: false,
    breadcrumbs: [],
  };

  const toggleConfirmed = () => setConfirmedModal(!confirmedModal);
  const togglePop = () => setPopoverOpen(!popoverOpen);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "Введіть коректне ім'я!")
      .required('Це поле не повинно бути пустим!')
      .matches(/^[a-zA-ZА-Яа-яёЁЇїІіЄєҐґ ]+$/, "Поле ім'я не може містити цифри та спецсимволи!"),
    lastName: Yup.string()
      .min(3, 'Введіть коректне прізвище!')
      .required('Це поле не повинно бути пустим!')
      .matches(/^[a-zA-ZА-Яа-яёЁЇїІіЄєҐґ ]+$/, "Поле ім'я не може містити цифри та спецсимволи!"),
    phoneNumber: Yup.string()
      .test(
        'length',
        'Неправильний номер телефону',
        (value: string | null | undefined): boolean => {
          if (typeof value === 'string') {
            const lengthOnlyNumbers = value.replace(/-|_/g, '').length;
            return lengthOnlyNumbers === 17;
          }
          return false;
        }
      )
      .required('Це поле не повинно бути пустим!'),
    email: Yup.string().email('Неправильна адреса!').required('Це поле не повинно бути пустим!'),
    comment: Yup.string().max(500, 'Максимальна кількість символів: 500'),
    deliveryMethod: !user ? Yup.string() : Yup.string().required('Вкажіть спосіб доставки'),
    courierDeliveryAddress: !user
      ? Yup.string()
      : Yup.string().when('deliveryMethod', {
          is: DeliveryMethods.courier,
          then: Yup.string().required('Вкажіть адресу доставки'),
        }),
    paymentMethod: user
      ? !paymentStatus
        ? Yup.string().required('Вкажіть спосіб оплати')
        : Yup.string()
      : Yup.string(),
  });

  const getSettlements = async (page: number) => {
    const { data } = await apiDelivery.newPost.getCity({
      apiKey: `${apiKey}`,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        Page: `${page}`,
        Limit: 30,
      },
    });
    if (page === 1) {
      setCities(data.data);
      return;
    }
    data.data.map((obj: any) => {
      setCities((prevState) => [...prevState, obj]);
    });
  };

  const searchSettlements = async (value: string) => {
    const { data } = await apiDelivery.newPost.getCity({
      apiKey: `${apiKey}`,
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: `${value}`,
        Limit: 50,
      },
    });
    setCities(data.data[0]?.Addresses);
  };

  useEffect(() => {
    if (!user && !isLoading && !productsInCart?.length) {
      router.push('/');
    }
  }, [productsInCart?.length]);

  useEffect(() => {
    if (selectCity) {
      const getWarehouses = async () => {
        if (selectCity?.value) {
          const { data: getWarehouses } = await apiDelivery.newPost.getStreet({
            apiKey: `${apiKey}`,
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
              CityRef: `${selectCity?.DeliveryCity}`,
            },
          });
          setStreets(getWarehouses.data);
          if (!getWarehouses.data.length)
            setSelectStreet({
              value: '',
              label: '',
              Ref: '',
            });
        }
      };
      getWarehouses();
    }
  }, [selectCity]);

  const changeInputCity = (value: string) => {
    if (value.trim().length >= 2) {
      setTimeout(() => {
        setDefaultList(false);
        searchSettlements(value);
      }, 500);
      return;
    }
    setTimeout(() => {
      setDefaultList(true);
      getSettlements(1);
    }, 500);
  };

  const getCities = (page: number) => {
    if (page > 0) {
      setTimeout(() => {
        getSettlements(page);
      }, 500);
    }
  };

  const createDelivery = async (data: IAddDelivery) => {
    const response = await api.delivery.createDelivery(data);
    if (response.error) {
      setPopoverState({ message: 'Вкажіть місто та відділення для доставки!' });
      togglePop();
      setTimeout(() => {
        setPopoverOpen(false);
      }, 5000);
      return;
    }
    if (response?.data?.id) {
      const { firstName, lastName, email, phoneNumber, comment, notcall, paymentMethod } =
        formik.values;
      const additionalFields: IAdditionalOrderFields = {};
      additionalFields.additionalFirstName = firstName;
      additionalFields.additionalLastName = lastName;
      additionalFields.additionalEmail = email;
      additionalFields.additionalNumber = phoneNumber;
      if (comment.trim().length) additionalFields.comment = comment;
      additionalFields.notcall = notcall;
      additionalFields.paymentMethod = paymentMethod;
      const { error } = await api.orders.changeOrderStatusPending({
        ...response?.data,
        ...additionalFields,
      });
      if (error) {
        setPopoverState({ ...error });
        togglePop();
        setTimeout(() => {
          setPopoverOpen(false);
        }, 5000);
        return;
      }

      if (paymentMethod === 'LiqPay') isGoToLiqpay(true);
      if (paymentMethod === 'Післяплата') await router.push('/thanks');
    }
  };
  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || '',
      deliveryMethod: deliveryValues?.deliveryMethod || '',
      courierDeliveryAddress: deliveryValues?.courierDeliveryAddress || '',
      paymentMethod: '',
      comment: deliveryValues?.comment || '',
      notcall: deliveryValues?.notcall || false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const { Area, MainDescription, value: Present, DeliveryCity } = selectCity;
      const { value: Description, Ref } = selectStreet;
      const deliveryData = {
        areaName: Area || '',
        cityName: MainDescription || '',
        cityFullName: Present || '',
        cityRef: DeliveryCity || '',
        streetName: Description || '',
        streetRef: Ref || '',
        deliveryMethod: formik.values.deliveryMethod || '',
        courierDeliveryAddress:
          formik.values.deliveryMethod === DeliveryMethods.courier
            ? formik.values.courierDeliveryAddress
            : null,
        paymentMethod: formik.values.paymentMethod || '',
      };
      if (!user) {
        const { data, error } = await registerCutUser(values);
        if (error) {
          setPopoverState({ ...error });
          togglePop();
          setTimeout(() => {
            setPopoverOpen(false);
          }, 5000);
          return;
        }
        const { token, user, isExistingUser, message } = data;
        if (message) {
          setPopoverState({ message: message });
          togglePop();
          setTimeout(() => {
            setPopoverOpen(false);
          }, 5000);
          return;
        }
        setGlobalUser(user);
        setToken(token);
        setVisible(!isExistingUser);
        await useCartReplace(mutate, cartData!);
        formik.touched.deliveryMethod = false;
        formik.touched.paymentMethod = false;
        return;
      }
      await createDelivery(deliveryData);
    },
  });

  useEffect(() => {
    onFocus();
    if (deliveryValuesLS) {
      setSelectCity(JSON.parse(deliveryValuesLS)?.selectCity);
      setSelectStreet(JSON.parse(deliveryValuesLS)?.selectStreet);
    }
    socket.connect();
    socket.on('awaitCallback', () => onFocus());
    return () => {
      socket.off('awaitCallback');
    };
  }, []);

  useEffect(() => {
    streets.length &&
      streets.findIndex((street) => street.Description === selectStreet?.value) === -1 &&
      setSelectStreet({
        value: '',
        label: '',
        Ref: '',
      });
  }, [streets]);

  useEffect(() => {
    localStorage.setItem(
      'deliveryValues',
      JSON.stringify({
        ...deliveryValues,
        deliveryMethod: formik.values.deliveryMethod,
        courierDeliveryAddress: formik.values.courierDeliveryAddress,
        comment: formik.values.comment,
        notcall: formik.values.notcall,
      })
    );
  }, [formik.values]);

  useEffect(() => {
    localStorage.setItem(
      'deliveryValues',
      JSON.stringify({ ...deliveryValues, selectCity, selectStreet })
    );
  }, [selectCity, selectStreet]);

  const handleChangeTab = (tab: React.SetStateAction<number>) => {
    setActive(tab);
  };

  const metaData = {
    title: 'Оформлення доставки',
    description: 'Сторінка оформлення доставки',
    addBrand: true,
  };

  const onFocus = async () => {
    const { data } = await api.productsInCart.getProductsFromCart();
    data?.liqpayPaymentStatus
      ? setPaymentStatus(data?.liqpayPaymentStatus)
      : setPaymentStatus(undefined);
  };

  useEffect(() => {
    if (user) {
      window.addEventListener('focus', onFocus);
    }
    onFocus();
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [paymentStatus, user]);

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <div className={styles['delivery_wrapper']}>
          {productsInCart?.length || !user ? (
            <>
              <h1>Оформити замовлення</h1>
              <LoginTab.Provider value={{ currentTab, setCurrentTab }}>
                <Auth
                  formik={formik}
                  headerName={headerName}
                  activeTab={handleChangeTab}
                  popoverState={popoverState}
                  popoverOpen={popoverOpen}
                  visible={visible}
                  toggleConfirmed={toggleConfirmed}
                  fastOrder={fastOrder}
                  returnToTab={activeTab}
                />
                <DeliveryWidget
                  formik={formik}
                  streets={streets}
                  cities={cities}
                  setSelectCity={setSelectCity}
                  selectCity={selectCity}
                  setSelectStreet={setSelectStreet}
                  selectStreet={selectStreet}
                  changeInputCity={changeInputCity}
                  getCities={getCities}
                  defaultList={defaultList}
                  cartData={cartData}
                  activeTab={active}
                  paymentStatus={paymentStatus}
                  goToLiqpay={goToLiqpay}
                />
              </LoginTab.Provider>
            </>
          ) : null}
        </div>
      </PageContainer>
    </MainLayout>
  );
};

export default DeliveryPage;
