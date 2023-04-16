import { FC } from 'react';
import { Container } from 'reactstrap';

import classes from './Footer.module.scss';
import { TopFooter } from './TopFooter/TopFooter';
import BottomFooter from './BottomFooter/BottomFooter';
import { CopyrightSection } from './CopyrigthSection/CopyrightSection';
import CompanyInformation from '../company-information/CompanyInformation';
import { CompanyInformation as CompanyInfo } from 'constants/company-information';

const Footer: FC = () => {
  return (
    <footer className={classes.wraper}>
      <div className={classes.footer}>
        <Container className={classes.footer__inner}>
          <CopyrightSection />
        </Container>
        <Container className={classes['footer__company-information-box']}>
          <CompanyInformation
            className={classes['company-info']}
            displayOrder={[CompanyInfo.PHONE_NUMBER_1, CompanyInfo.SСHEDULE]}
          />
        </Container>
        <Container className={classes.footer__top}>
          <TopFooter />
          <BottomFooter />
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
