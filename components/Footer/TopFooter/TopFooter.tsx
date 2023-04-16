import { Container, Row } from 'reactstrap';
import { FC } from 'react';
// import Link from 'next/link';

import ModalExample from '../Modal'
import { FacebookSvg } from 'components/svgs/Facebook.svg';
import { InstagramSvg } from 'components/svgs/Instagram.svg';
// import { TwitterSvg } from 'components/svgs/Twitter.svg';
// import { WhattsupSvg } from 'components/svgs/Whattsup.svg';
import classes from './TopFooter.module.scss';

export const TopFooter: FC = () => {
  return (
    <section>
      <Container className={classes.topfooter}>
        <Row className={classes.topfooter__container}>
          {/* <Col className={classes.topfooter__list}>
          <ul>
            <li>
              <Link href='/'>Питання та відповіді</Link>
            </li>
            <li>
              <Link href='/'>Допомога</Link>
            </li>
            <li>
              <Link href='/'>Особистий кабінет</Link>
            </li>
          </ul>
        </Col>

        <Col className={classes.topfooter__list}>
          <ul>
            <li>
              <Link href='/'>Медіа-центр</Link>
            </li>
            <li>
              <Link href='/'>Офіційні представники</Link>
            </li>
            <li>
              <Link href='/'>Вакансії</Link>
            </li>
          </ul>
        </Col>

        <Col className={classes.topfooter__list}>
          <ul>
            <li>
              <Link href='/'>Огляди</Link>
            </li>
            <li>
              <Link href='/'>Умови користування</Link>
            </li>
            <li>
              <Link href='/'>Приватність</Link>
            </li>
          </ul>
        </Col> */}

          <div className={classes.topfooter__icons}>
          <ModalExample/>
            <a
              href="https://www.facebook.com/Buy_All-110809101051972/?view_public_for=110809101051972"
              target="_blank"
            >
              <FacebookSvg />
            </a>
            <a href="https://instagram.com/buy_all_store?utm_medium=copy_link" target="_blank">
              <InstagramSvg />
            </a>
            {/* <Link href='/'>
            <WhattsupSvg />
          </Link> */}
            {/* <Link href='/'>
            <TwitterSvg />
          </Link> */}
          </div>
        </Row>
      </Container>
    </section>
  );
};
