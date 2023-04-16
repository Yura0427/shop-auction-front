import { FC } from 'react';
// import Link from 'next/link';

import classes from './BottomFooter.module.scss';
import { Container, Row } from 'reactstrap';

const BottomFooter: FC = () => {
  return (
    <section>
      <Container className={classes.bottomfooter}>
        {/* <Row className={classes.bottomfooter__container}>
        <Link href='/'>Умови використання сайту</Link>
        <Link href='/'>Приватність</Link>
        <Link href='/'>Розробники</Link>
        <Link href='/'>Художники</Link>
        <Link href='/'>Про нас</Link>
        <span>Мова: УКР</span>
    </Row> */}
        <Row className={classes.bottomfooter__container__design}>
          <span>
            Designed by{' '}
            <a href="https://waf.com.ua/" target="_blank">
              We are the future
            </a>
          </span>
        </Row>
      </Container>
    </section>
  );
};

export default BottomFooter;
