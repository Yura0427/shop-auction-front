import * as React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { VisaSvg } from 'components/svgs/Visa.svg';
import classes from './TopFooter/TopFooter.module.scss';
import { MasterCardSvg } from 'components/svgs/MasterCard.svg';
class ModalExample extends React.Component<{  }, {modal: boolean;modals: boolean;}> {
    state = {
        modal: false,
        modals: false
      };

      toggleMasterCart = () => {
      this.setState({
        modal: !this.state.modal
      });
    }
    toggleVisa = () => {
      this.setState({
        modals: !this.state.modals
      });
    }

    render() {
        return (
            <div style={{ marginTop: -12 }}>
                <a className={classes.card}
                    onClick={this.toggleMasterCart}
                    target="_blank"
                >
                    <MasterCardSvg />
                </a>

                <a className={classes.card__master}
                    onClick={this.toggleVisa}
                    target="_blank"
                >
                    <VisaSvg />
                </a>
                <Modal funk={true} isOpen={this.state.modals} toggle={this.toggleVisa}>
                    <ModalHeader toggle={this.toggleVisa}>Verified by Visa</ModalHeader>
                    <ModalBody>
                    <p>Платіжні системи у партнерстві з банками-емітентами впроваджують сучасні схеми перевірки особистості власника картки, щоб зробити покупки в Інтернеті безпечнішими. Встановлюється спеціальний пароль для кожної операції, і це вселяє у Вас впевненість, що тільки Ви можете робити такі покупки онлайн. Сучасні технологічні рішення необхідні для того, щоб утримувач карти був упевнений у безпеці транзакції і в тому, що він має справу зі справжнім (а не «підставним») магазином.</p>

                    <p>Одне з таких технологічних рішень називається Verified by Visa (Перевірено Visa).</p>
                    <p>Verified by Visa - це нова система захисту, яка сповіщає онлайн-торгівців, що беруть участь у програмі, і банки про те, що Ви є справжнім власником картки, коли Ви робите онлайн-покупки. Вона дозволяє Вам використовувати персональний пароль для підтвердження Вашої особи та захисту Вашої картки Visa, коли Ви використовуєте її в Інтернеті, вселяючи велику впевненість у вчинених Вами діях.</p>
                    <p>До технології Verified by Visa легко підключитись, її легко використовувати, послуга діє для всіх карток Visa.</p>
                    <p>Для активації послуги Verified by Visa для Вашої картки необхідно звернутися до Вашого банку.</p>
                    </ModalBody>
                </Modal>
                <Modal funk={true} isOpen={this.state.modal} toggle={this.toggleMasterCart}>
                    <ModalHeader toggle={this.toggleMasterCart}>MasterCard®  SecureCode™</ModalHeader>
                    <ModalBody>
                        <p>MasterCard® SecureCode™- це технологія, яка забезпечує Вашу карту MasterCard® або Маestro® додатковим секретним кодом, що захищає її від несанкціонованого використання під час здійснення покупок в інтернет-магазинах, що беруть участь у програмі.</p>
                        <p>Щоб підключити технологію SecureCode, необхідно звернутися до банку, який випустив Вашу картку.  Ваш секретний код буде відомий лише Вам та Вашому банку.  Далі, при кожній оплаті покупок або послуг в інтернет-магазинах, що беруть участь у програмі, Ваш банк запропонує Вам ввести цей секретний код, який Ви отримаєте на Ваш мобільний телефон, зареєстрований у банку.  Тільки після перевірки та підтвердження банком даного коду операцію з оплати буде здійснено.  Процедура використання технології SecureCode така проста, як введення PIN-коду в банкоматі.</p>
                        <p>Ввівши правильний SecureСode у процесі покупки, Ви підтверджуєте, що є авторизованим власником картки.  Якщо введено неправильний SecureCode, покупка не буде здійснена.  Навіть якщо комусь відомий номер Вашої платіжної картки, без SecureCode не вдасться сплатити за покупку в інтернет-магазинах, що беруть участь у програмі.</p>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default ModalExample; 