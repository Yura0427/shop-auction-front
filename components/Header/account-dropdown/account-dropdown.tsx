import React, { FC, useContext, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { EAccountPages, EAccountUrls } from 'interfaces/account/account.enum';
import UserAvatar from 'components/user-avatar';
import { UserContext } from '../../context/user-context';
import { useMounted } from 'hooks/useMounted';
import styles from './account-dropdown.module.scss';
import Route from '../../route/Route';
import { RiAccountCircleLine } from 'react-icons/ri';
import { FcTodoList } from "react-icons/fc";
import { MdFavoriteBorder } from 'react-icons/md';
import { BiCommentDetail } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';

interface AccountDropdownProps {
  toggleLogout: React.MouseEventHandler<HTMLElement>;
}

const AccountDropdown: FC<AccountDropdownProps> = ({ toggleLogout }) => {
  const { user } = useContext(UserContext);
  const { mounted } = useMounted();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <>
      {user && mounted ? (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} className={styles.dropdown}>
          <DropdownToggle caret>
            <UserAvatar />
            <span>Мій профіль</span>
          </DropdownToggle>
          <DropdownMenu>
            {/*<DropdownItem>*/}
            {/*  <Route href={`/account/${EAccountUrls.advertisements}`}>*/}
            {/*    {EAccountPages.advertisements}*/}
            {/*  </Route>*/}
            {/*</DropdownItem>*/}
            <DropdownItem>
              <Route href={`/account/${EAccountUrls.orders}`}>
                <FcTodoList size={18} className={ styles.history_icon}/>
                {EAccountPages.orders}
              </Route>
            </DropdownItem>
            <DropdownItem>
              <Route href={`/account/${EAccountUrls.favorite}`}>
                <MdFavoriteBorder size={18} />
                {EAccountPages.favorite}
              </Route>
            </DropdownItem>
            <DropdownItem>
              <Route href={`/account/${EAccountUrls.comments}`}>
                <BiCommentDetail size={18} />
                {EAccountPages.comments}
              </Route>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <Route href={`/account/${EAccountUrls.personalInfo}`}>
                <RiAccountCircleLine size={18} />
                {EAccountPages.personalInfo}
              </Route>
            </DropdownItem>
            <DropdownItem onClick={toggleLogout}>
              <FiLogOut size={18} />
              Вийти
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : null}
    </>
  );
};

export default AccountDropdown;
