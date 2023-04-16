import { FetchDataType } from '../index';
import deliveryAxios from './delivery-api';

export type APIFetchDataType = {
  newPost: {
    getCity: (obj: any) => FetchDataType<any>;
    getStreet: (obj: any) => FetchDataType<any>;
  };
};

export const apiDelivery: APIFetchDataType = Object.freeze({
  newPost: {
    getCity: (params) => deliveryAxios.post('json/', { ...params }),
    getStreet: (params) => deliveryAxios.post('json/', { ...params }),
  },
});
