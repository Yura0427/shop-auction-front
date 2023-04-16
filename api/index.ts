import { AxiosResponse } from 'axios';

import { ICategory, ICategoryTree, IMainCategory } from '../interfaces/category/category';
import {
  INewArrivalProducts,
  IProduct,
  IProductsSearchResponse,
  IProductRating,
  PaginatedProducts,
  ProductInListCategory,
} from '../interfaces/product/products';
import {
  IAddProductInCart,
  IProductInCart,
  IProductsInCartData,
  ISingleProductToCart,
  UpdateOrder,
} from '../interfaces/product/products-in-cart';
import instance, { ssrInstance } from './axios-interceptors';
import { ISettings } from '../interfaces/settings';
import {
  IAuthResponse,
  IFbUser,
  IGoogleUser,
  IRegister,
  IUser,
  IResponseMessage,
  IFeedbackUser,
  IResetPassword,
  IFastRegister,
  IUserProfile,
  IUserResponse,
  IPreResetPassword,
} from '../interfaces/user/userData';

import { IFilterReqData } from '../interfaces/filters/filtersData';
import {
  IAddComment,
  ICommentResponse,
  IGetComment,
  IUpdateComment,
} from 'interfaces/comment/comment';
import { IAddFeedback } from 'interfaces/feedback/feedback';
import { IUpdateUser } from 'interfaces/account/update-user.interface';
import { ICreateOrder, IOrdersResponse } from 'interfaces/order';
import { IChangePassword } from 'interfaces/account/change-password.interface';
import { IChangeEmail, ISendChangeEmail } from 'interfaces/account/change-email.interface';
import { IGetLikeResponse, ILikeResponse } from '../interfaces/like';
import { IAddDelivery, IGetDelivery } from '../interfaces/delivery/delivery';
import { characteristicsValuesByName } from 'interfaces/characteristicsValues';

export type FetchDataType<T> = Promise<AxiosResponse<T>>;

type CustomResponse<T> = AxiosResponse<T> & {
  error: {
    message: string;
    statusCode: number;
  };
};
export type FetchCustomDataType<T> = Promise<CustomResponse<T>>;

export type APIFetchDataType = {
  categories: {
    fetch: () => FetchDataType<ICategory[]>;
    getInfo: (key: string | string[]) => FetchDataType<ICategory>;
    fetchMain: () => FetchDataType<IMainCategory[]>;
    fetchMainByKey: (key: string) => FetchDataType<IMainCategory>;
    getByKey: (key: string) => FetchDataType<ICategory>;
    getTree: () => FetchDataType<ICategoryTree[]>;
  };
  products: {
    getByCategoryKey: (
      key: string | string[],
      take: number,
      skip: number
    ) => FetchDataType<{ products: IProduct[]; count: number }>;
    getByCategory: (key: string | string[]) => FetchDataType<ICategory>;
    getAll: (page: number, limit: number) => FetchDataType<PaginatedProducts>;
    getByKey: (key: string | string[]) => FetchDataType<IProduct>;
    getNewArrivals: (take: number) => FetchDataType<IProduct[]>;
    getNewArrivalProductsWithParameter: (name: string) => FetchDataType<INewArrivalProducts>;
    getSearchProducts: (
      searchQuery: string,
      page: number
    ) => FetchDataType<IProductsSearchResponse>;
    getInListCategory: (
      key: string | string[],
      take: number,
      skip: number
    ) => FetchDataType<ProductInListCategory>;
  };
  productsInCart: {
    addProductsInCart: (
      singleProduct: ISingleProductToCart | null,
      data: IAddProductInCart[] | null
    ) => FetchDataType<IProductInCart>;
    getProductsFromCart: () => FetchDataType<IProductsInCartData>;
    deleteProductFromCart: (productId: number) => FetchDataType<number>;
    updateProductFromCart: (id: number, data: UpdateOrder) => FetchDataType<number>;
    emptyCart: () => FetchDataType<IProductInCart[]>;
  };
  orders: {
    getUserOrders: (userId: number, page: number) => FetchDataType<IOrdersResponse>;
    cancelOrder: (orderId: number) => FetchDataType<IResponseMessage>;
    changeOrderStatusPending: (delivery?: ICreateOrder) => FetchCustomDataType<IResponseMessage>;
    getOrderById: (orderId: number) => FetchDataType<IOrdersResponse>;
  };
  parameters: {
    getParametersByName: (name: string) => FetchDataType<ISettings>;
  };
  comments: {
    getByProduct: (productId: number, page: number) => FetchDataType<ICommentResponse>;
    addComment: (comment: IAddComment) => FetchDataType<IGetComment>;
    updateComment: (commentId: number, text: IUpdateComment) => FetchDataType<IGetComment>;
    deleteComment: (commentId: number) => FetchDataType<string>;
  };
  feedbacks: {
    addFeedback: (feedback: IAddFeedback) => FetchCustomDataType<IResponseMessage>;
  };
  user: {
    login: (email: string, password: string) => FetchCustomDataType<IAuthResponse>;
    getUser: () => FetchDataType<IUserProfile>;
    getRegistredUsers: () => FetchDataType<IUser[]>;
    uploadAvatar: (data: FormData) => FetchDataType<IResponseMessage>;
    deleteAvatar: () => FetchDataType<IResponseMessage>;
    updateUser: (id: number, data: IUpdateUser) => FetchCustomDataType<IUserResponse>;
    register: (data: IRegister) => FetchCustomDataType<IAuthResponse>;
    resendMessage: (data: string) => FetchCustomDataType<IAuthResponse>;
    registerCutUser: (data: IFastRegister) => FetchCustomDataType<IAuthResponse>;
    googleSignIn: (data: IGoogleUser) => FetchDataType<IAuthResponse>;
    fbSignIn: (data: IFbUser) => FetchDataType<IAuthResponse>;
    changePassword: (data: IChangePassword) => FetchDataType<IUser>;
    feedbackUser: (data: IFeedbackUser) => FetchCustomDataType<IResponseMessage>;
    sendRequestChangeEmail: (data: ISendChangeEmail) => FetchCustomDataType<IResponseMessage>;
    changeEmail: (data: IChangeEmail) => FetchCustomDataType<IAuthResponse>;
    verifyAccount: (data: { token: string; userId: number }) => FetchCustomDataType<IAuthResponse>;
    requestPasswordInstall: (data: { email: string }) => FetchCustomDataType<IResponseMessage>;
    resetPassword: (data: IResetPassword) => FetchDataType<IUser>;
    preResetPassword: (data: IPreResetPassword) => FetchDataType<IResponseMessage>;
  };
  filters: {
    getProducts: (data: IFilterReqData) => FetchDataType<{ product: IProduct[]; count: number }>;
    getCharacteristicValuesByNeme: (
      characteristicId: number
    ) => FetchDataType<characteristicsValuesByName[]>;
  };
  ratings: {
    addRating: (data: { currentRating: number; productId: number }) => FetchDataType<IProduct>;
    getRatingById: (productId: number) => FetchDataType<IProductRating>;
  };
  likes: {
    addLikeProduct: (productId: number) => FetchDataType<IGetLikeResponse[]>;
    getUserLikesProduct: (userId: number, page: number) => FetchDataType<ILikeResponse>;
    getLikeProduct: (productsId: any) => FetchDataType<IGetLikeResponse[]>;
  };
  delivery: {
    createDelivery: (delivery: IAddDelivery) => FetchCustomDataType<IGetDelivery>;
  };
};

export const api: APIFetchDataType = Object.freeze({
  categories: {
    fetch: () => instance.get(`/category/`),
    getInfo: (key) => ssrInstance.get(`/category/key/${key}`),
    fetchMain: () => instance.get('/mainCategory'),
    fetchMainByKey: (key) => ssrInstance.get(`/mainCategory/key/${key}`),
    getByKey: (key) => ssrInstance.get(`/category/tree/key/${key}?hideDisabled=true`),
    getTree: () => ssrInstance.get('/category/tree?hideDisabled=true'),
  },
  products: {
    getByCategoryKey: (key, take, skip) =>
      instance.get(`/product/category/${key}?take=${take}&skip=${skip}`),
    getByCategory: (key) => ssrInstance.get(`/category/key/${key}`),
    getAll: (page, limit) => instance.get(`product?page=${page}&limit=${limit}`),
    getByKey: (key) => ssrInstance.get(`/product/key/${key}`),
    getNewArrivals: (take) => instance.get(`/product/newarrivals?take=${take}`),
    getNewArrivalProductsWithParameter: (name) =>
      instance.get(`/product/sliderNewArrivals/${name}`),
    getSearchProducts: (searchQuery, page) =>
      instance.get(`/product/search/${searchQuery}?page=${page}`),
    getInListCategory: (key, take, skip) =>
      ssrInstance.get(`/product/listCategory/${key}?take=${take}&skip=${skip}`),
  },
  productsInCart: {
    getProductsFromCart: () => instance.get(`/orders/cart`),
    addProductsInCart: (singleProduct, data) =>
      instance.post(`/orders/cart`, {
        singleProduct,
        orderValues: data,
      }),
    updateProductFromCart: (id, data) => instance.put(`/orders/cart/${id}`, { ...data }),
    deleteProductFromCart: (productId) => instance.delete(`/orders/cart/${productId}`),
    emptyCart: () => instance.delete(`/orders/clear-cart`),
  },
  orders: {
    getUserOrders: (userId, page) => instance.get(`/orders/user/${userId}?page=${page}`),
    cancelOrder: (orderId) => instance.patch(`/orders/status/cancelled/${orderId}`),
    changeOrderStatusPending: (data) => instance.patch(`/orders/status/pending`, { ...data }),
    getOrderById: (orderId) => instance.get(`/orders/get/${orderId}`),
  },
  parameters: {
    getParametersByName: (name) => instance.get(`/parameters/${name}`),
  },
  user: {
    login: (email, password) =>
      instance.post(`auth/login`, {
        email,
        password,
      }),
    getUser: () => instance.get(`users/profile`),
    getRegistredUsers: () => instance.get(`users/registred-users`),
    register: (data) =>
      instance.post(`auth/register`, {
        ...data,
      }),
    resendMessage: (email) =>
      instance.post(`auth/resend-message`, {
        email,
      }),
    registerCutUser: (data) =>
      instance.post(`auth/fast-register`, {
        ...data,
      }),
    googleSignIn: (data) => instance.post(`auth/google`, data),
    fbSignIn: (data) => instance.post(`auth/facebook`, { ...data }),
    uploadAvatar: (data) => instance.post('users/avatar/add', data),
    deleteAvatar: () => instance.delete(`users/avatar`),
    updateUser: (id, data) => instance.put(`users/${id}`, data),
    changePassword: (data) => instance.patch(`users/password`, { ...data }),
    feedbackUser: (data) => instance.post(`users/feedbackUser`, { ...data }),
    sendRequestChangeEmail: (data) => instance.post(`users/email/change`, { ...data }),
    changeEmail: (data) => instance.post(`users/newEmail/set`, { ...data }),
    verifyAccount: (data) => instance.post(`auth/verify`, data),
    requestPasswordInstall: (data) => instance.post(`users/password/reset`, { ...data }),
    resetPassword: (data) => instance.post(`users/password/install`, { ...data }),
    preResetPassword: (data) => instance.post(`users/password/preinstall`, { ...data }),
  },
  filters: {
    getProducts: (data) => instance.post('/filters', { ...data }),
    getCharacteristicValuesByNeme: (characteristicId) =>
      instance.get(`characteristics-values?id=${characteristicId}`),
  },
  comments: {
    getByProduct: (productId, page) => instance.get(`comments/product/${productId}?page=${page}`),
    addComment: (comment) => instance.post('comments', comment),
    updateComment: (commentId, comment) => instance.patch(`comments/${commentId}`, comment),
    deleteComment: (commentId) => instance.delete(`comments/${commentId}`),
  },
  feedbacks: {
    addFeedback: (feedback) => instance.post('feedbacks', feedback),
  },
  ratings: {
    addRating: (data) => instance.post('ratings', { ...data }),
    getRatingById: (productId) => instance.get(`ratings/avgRating/${productId}`),
  },
  likes: {
    addLikeProduct: (productId) => instance.post(`likes/product`, { productId }),
    getUserLikesProduct: (userId, page) => instance.get(`likes/product/${userId}?page=${page}`),
    getLikeProduct: (productsId) => instance.get(`likes/product?${productsId}`),
  },
  delivery: {
    createDelivery: (data) => instance.post('delivery', { ...data }),
  },
});
