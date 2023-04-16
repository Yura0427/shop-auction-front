import { createHash } from 'crypto';

export function formAndGetJsonString(
  action: string,
  amount: number | undefined,
  currency: string,
  description: string,
  order_id: string | undefined
) {
  const result_url =
    process.env.NODE_ENV === 'production'
      ? 'https://' + process.env.NEXT_PUBLIC_REACT_APP_FRONT_DOMAIN + '/after-liqpay'
      : 'http://' + process.env.NEXT_PUBLIC_REACT_APP_FRONT_DOMAIN + '/after-liqpay';
  const obj = {
    public_key: process.env.NEXT_PUBLIC_REACT_APP_PUBLIC_KEY_LIQPAY,
    private_key: process.env.NEXT_PUBLIC_REACT_APP_PRIVATE_KEY_LIQPAY,
    version: '3',
    action,
    amount,
    currency,
    description,
    order_id,
    result_url,
  };

  return JSON.stringify(obj);
}

export function formAndGetData(jsonString: string) {
  return Buffer.from(jsonString).toString('base64');
}

export function formAndGetSignature(str: string) {
  return createHash('sha1').update(str).digest('base64');
}
