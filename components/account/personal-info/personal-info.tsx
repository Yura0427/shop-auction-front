import React, { FC, ReactNode, useContext, useState } from 'react';
import { Collapse } from 'reactstrap';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

import { EAccountPages } from 'interfaces/account/account.enum';
import MainInfo from './main-info/main-info';
import ChangeAvatar from './change-avatar/change-avatar';
import ChangePassword from './change-password/change-password';
import { EAccountMainInfo } from 'interfaces/account/account-main-info.enum';
import styles from './personal-info.module.scss';
import { UserContext } from '../../context/user-context';
import CreatePassword from './create-password/create-password';
import SendChangeEmail from './change-email/change-email';
import { useSelector } from 'react-redux';
import { RootState } from './../../../interfaces/avatarExamination/avatar';

interface ExpandableBlockProps {
  blockName: string;
  toggleOpen: (section: string) => void;
  openSections: string[];
  title: string;
  children: ReactNode;
}

const ExpandableBlock: FC<ExpandableBlockProps> = ({
  blockName,
  toggleOpen,
  openSections,
  title,
  children,
}) => {
  return (
    <div className={styles.block}>
      <div className={styles['block-header']} onClick={() => toggleOpen(blockName)}>
        <span>
          {openSections.includes(blockName) ? (
            <IoIosArrowDown size={23} />
          ) : (
            <IoIosArrowForward size={23} />
          )}
        </span>
        <h5>{title}</h5>
      </div>
      <Collapse isOpen={openSections.includes(blockName)}>
        <div className={styles.children}>{children}</div>
      </Collapse>
    </div>
  );
};

const PersonalInfo: FC = () => {
  const avatarDataError = useSelector((state: RootState) => state.avatarReduser.errorAvatar);

  const { user } = useContext(UserContext);
  const initialBlocksOpen = user !== null && user.phoneNumber !== null ? [] : ['main'];
  const [openSections, setOpenSections] = useState<string[]>(initialBlocksOpen);



  const toggleOpen = (section: string) => {
    openSections.includes(section)
      ? setOpenSections(openSections.filter((sec) => sec !== section))
      : setOpenSections(openSections.concat(section));
  };

  return (
    <div>
      <h3 className={styles['page-name']}>{EAccountPages.personalInfo}</h3>
      {user ? (
        <>
          <ExpandableBlock
            blockName={EAccountMainInfo.main}
            toggleOpen={toggleOpen}
            openSections={openSections}
            title="Особисті дані"
          >
            <MainInfo />
          </ExpandableBlock>

          <ExpandableBlock
            blockName={EAccountMainInfo.avatar}
            toggleOpen={toggleOpen}
            openSections={openSections}
            title="Змінити аватар"
          >
            <ChangeAvatar />

          </ExpandableBlock>

          <ExpandableBlock
            blockName={EAccountMainInfo.email}
            toggleOpen={toggleOpen}
            openSections={openSections}
            title="Змінити адресу електронної пошти"
          >
            <SendChangeEmail />
          </ExpandableBlock>

          <ExpandableBlock
            blockName={EAccountMainInfo.password}
            toggleOpen={toggleOpen}
            openSections={openSections}
            title="Змінити пароль"
          >
            {user.hasPassword ? <ChangePassword /> : <CreatePassword />}
          </ExpandableBlock>
        </>
      ) : null}
    </div>
  );
};

export default PersonalInfo;
