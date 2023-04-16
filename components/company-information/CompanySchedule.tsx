import { AiOutlineClockCircle } from 'react-icons/ai';
import React, { FC } from 'react';

import { CompanyInformation as CompanyInfo } from '../../constants/company-information';

const CompanySchedule: FC = () => {
  return (
    <div>
      <AiOutlineClockCircle />
      <span>Графік роботи: {CompanyInfo.SСHEDULE}</span>
    </div>
  );
};

export default CompanySchedule;
