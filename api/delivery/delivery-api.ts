import axios from 'axios';

const deliveryUrl = process.env.NEXT_PUBLIC_REACT_APP_DELIVERY_API_URL;

const deliveryAxios = axios.create({
  baseURL: `${deliveryUrl}`,
});

export default deliveryAxios;
