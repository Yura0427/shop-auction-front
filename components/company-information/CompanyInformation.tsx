import React, { FC } from 'react';

import { CompanyInformation as CompanyInfo } from 'constants/company-information';
import ICompanyInformationProps from './company-information.props';
import styles from './company-information.module.scss';
import CompanySchedule from './CompanySchedule';
import CompanyPhone from './CompanyPhone';

const CompanyInformation: FC<ICompanyInformationProps> = ({ className, displayOrder }) => {
  const content = displayOrder.map((el, i) => {
    switch (el) {
      case CompanyInfo.SСHEDULE:
        return <CompanySchedule key={el + i} />;
      case CompanyInfo.PHONE_NUMBER_1:
        return <CompanyPhone key={el + i} />;
      default:
        return <></>;
    }
  });

  return <div className={`${styles['company-information']} ${className}`}>{content}</div>;
};

export default CompanyInformation;
