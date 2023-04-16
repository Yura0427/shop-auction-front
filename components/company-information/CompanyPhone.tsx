import React, { FC } from 'react';

import { CompanyInformation as CompanyInfo } from '../../constants/company-information';
import { PhoneSvg } from 'components/svgs/phone';

const CompanyPhone: FC = () => {
  return (
    <div>
      <a href={`tel:${CompanyInfo.PHONE_NUMBER_1}`}>
        <PhoneSvg />
        {CompanyInfo.PHONE_NUMBER_1}
      </a>
    </div>
  );
};

export default CompanyPhone;
