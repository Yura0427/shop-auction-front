import { FC, useEffect } from 'react';
import styles from './liqpay.module.scss';

interface LiqpayFormProps {
  data: string;
  signature: string;
  amount: number | undefined;
  currency?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
  goToLiqpay: boolean;
}

const LiqpayForm: FC<LiqpayFormProps> = ({
  data,
  signature,
  amount,
  currency = 'UAH',
  width,
  height,
  borderRadius,
  margin,
  goToLiqpay
}) => {
  useEffect(() => {
    if (goToLiqpay) document.getElementById("liqPayForm")?.submit()
  }, [goToLiqpay])
  return (
    <form
      id='liqPayForm'
      method="POST"
      acceptCharset="utf-8"
      action="https://www.liqpay.ua/api/3/checkout"
      // target="_blank"
    >
      <input type="hidden" name="data" defaultValue={data} />
      <input type="hidden" name="signature" defaultValue={signature} />
      <button style={{ width, height, borderRadius, margin }} className={styles.liqpayButton}>
        <img
          src="https://static.liqpay.ua/buttons/logo-small.png"
          style={{
            marginRight: '10px',
            verticalAlign: 'middle',
          }}
        />
        <span style={{ verticalAlign: 'middle' }}>
          Сплатити {amount} {currency}
        </span>
      </button>
    </form>
  );
};

export default LiqpayForm;
