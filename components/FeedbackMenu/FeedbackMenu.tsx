import React, { useState, useEffect } from 'react';
import styles from './FeedbackMenu.module.scss';
import UserFeedback from '../modals/user-feedback/user-feedback';
import { Fade } from 'reactstrap';
import { RiMessengerFill } from 'react-icons/ri';
import { BiConversation } from 'react-icons/bi';
import { VscChromeClose } from 'react-icons/vsc';
import classNames from 'classnames';

declare global {
  interface Window {
    fbAsyncInit: any;
  }
}

declare let FB: any;

const FeedbackMenu = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const menuHandleClick = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    window.fbAsyncInit = window.fbAsyncInit || {};
    let chatbox = document.getElementById('fb-customer-chat');
    const pageId = process.env.NEXT_PUBLIC_REACT_APP_FACEBOOK_PAGE_ID;
    chatbox?.setAttribute('page_id', pageId ? pageId : '');
    chatbox?.setAttribute('attribution', 'biz_inbox');

    const myFbButton = document.getElementById('my-fb-button');

    myFbButton?.addEventListener('click', () => {
      FB.CustomerChat.showDialog();
    });

    window.fbAsyncInit = function () {
      FB.init({ xfbml: true, version: 'v14.0' });
    };

    injectFbSdkAsync(document, 'script', 'facebook-jssdk');

    function injectFbSdkAsync(d: any, s: string, id: string) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
      fjs?.parentNode?.insertBefore(js, fjs);
    }
  }, []);

  return (
    <div className={styles.menuBlock} id="test">
      <Fade in={menuOpen} className={styles.animation} >
        <div className={styles.menuBlock_body}>
          <div className={styles.menuBlock_body_row}>
            <span className={styles.menuBlock_body_row_icon}>
              <UserFeedback setMenuOpen={setMenuOpen} />
            </span>
          </div>
          <div className={styles.menuBlock_body_row}>
            <div id="fb-root" style={menuOpen ? { display: 'block' } : { display: 'none' }}></div>
            <div id="fb-customer-chat" className="fb-customerchat"></div>
            <span
              id="my-fb-button"
              className={styles.msgFbBtn}>
              <RiMessengerFill className={styles.msgFbBtn_svgSize} />
            </span>
          </div>
        </div>
      </Fade>
      <div
        className={classNames(styles.menuBtn, { [styles.active]: menuOpen })}
        onClick={() => menuHandleClick()}
      >
        {!menuOpen ? <BiConversation /> : <VscChromeClose />}
      </div>
    </div>
  );
};

export default FeedbackMenu;
