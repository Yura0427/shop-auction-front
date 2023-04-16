import { CompanyInformation } from 'constants/company-information';

type valueOfCompanyInformation = typeof CompanyInformation[keyof typeof CompanyInformation];

interface ICompanyInformationProps {
  className: string;
  displayOrder: Array<valueOfCompanyInformation>;
}

export default ICompanyInformationProps;
