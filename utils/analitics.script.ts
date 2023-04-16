import { IOrderDataAnalictics } from '../interfaces/ecomerceData.interface';

export const analiticsScript = ({
  transactionId,
  transactionAffiliation,
  transactionTotal,
  transactionProducts,
}: IOrderDataAnalictics) => {
  let dataArr = [];
  dataArr.push({
    transactionId,
    transactionAffiliation,
    transactionTotal,
    transactionProducts,
  });
  return JSON.stringify(dataArr);
};
