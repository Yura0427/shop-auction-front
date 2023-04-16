import { IPageProps } from '../interfaces/page';
import React, { FC } from 'react';
import { useCategories } from '../hooks/useCategories';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import MainLayout from '../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import styles from './common-page.module.scss';
import { GetServerSideProps } from 'next';
import { api } from '../api';

const Policy: FC<IPageProps> = ({ categories }) => {
  const { allCategories } = useCategories(categories);

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs: [
      { name: 'Головна', key: '/' },
      { name: 'Політика конфіденційності', key: '' },
    ],
  };

  const metaData = {
    title: 'Політика конфіденційності',
    description: 'Умови політики конфіденційності.',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <h1 className={styles.heading}>Політика конфіденційності</h1>
        <div className={styles.privacyPolicy}>
          <h2>1 Визначення термінів</h2>
          <p>
            <strong>1.1</strong> Інтернет-магазин – сайт за адресою https://buy-all.store,
            виключними правами на який володіє Продавець, створений для укладення договорів
            роздрібної купівлі-продажу товарів на підставі наданих Покупцем чи Третьою особою
            персональних даних.
          </p>
          <p>
            <strong>1.2</strong> Продавець – фізична особа-підприємець Жарий Ігор Анатолійович
            (РНОКПП 0000000000), місцезнаходження якої: Україна, м. Вінниця, що є власником сайту
            https://buy-all.store та самостійно організовує та/або здійснює обробку персональних
            даних Покупця та Третьої особи, а також визначає цілі обробки персональних даних, склад
            персональних даних, що підлягають обробці, дії (операції), що здійснюються з
            персональними даними.
          </p>
          <p>
            <strong>1.3</strong> Покупець – фізична особа, яка здійснює замовлення товару на сайті
            Інтернет-магазину, надаючи персональні дані про себе чи про Третю особу.
          </p>
          <p>
            <strong>1.4</strong> Третя особа – фізична особа, на користь якої Покупець здійснює
            оформлення замовлення товару, відповідаючи на питання анкети (надаючи персональні дані
            такої особи) або яка самостійно надає відповіді на питання анкети (надаючи власні
            персональні дані).
          </p>
          <p>
            <strong>1.5</strong> Персональні дані – будь-які відомості чи сукупність відомостей про
            Покупця та Третю особу, які ідентифіковані або можуть бути конкретно ідентифіковані.
          </p>
          <p>
            <strong>1.6</strong> Знеособлення персональних даних – дії, в результаті яких неможливо
            визначити без використання додаткової інформації приналежність персональних даних
            Покупцеві або Третій особі.
          </p>
          <p>
            <strong>1.7</strong> Обробка персональних даних – будь-яка дія (операція) або сукупність
            дій (операцій), що здійснюються з використанням засобів автоматизації або без
            використання таких засобів з персональними даними, включаючи збір, запис,
            систематизацію, накопичення, зберігання, уточнення (оновлення, зміна), витяг,
            використання, передачу (поширення, надання, доступ), знеособлення, блокування,
            видалення, знищення персональних даних.
          </p>
          <p>
            <strong>1.8</strong> Надання (передача) персональних даних – дії, спрямовані на
            розкриття персональних даних певній особі або певному колу осіб.
          </p>
          <p>
            <strong>1.9</strong> Поширення персональних даних – будь-які дії, спрямовані на
            розкриття персональних даних невизначеному колу осіб (передача персональних даних) або
            на ознайомлення з персональними даними Покупця та Третьої особи, в тому числі
            оприлюднення персональних даних в засобах масової інформації, розміщення в
            інформаційно-телекомунікаційних мережах або надання доступу до персональних даних
            будь-яким іншим способом.
          </p>
          <p>
            <strong>1.10</strong> Транскордонна передача персональних даних – передача персональних
            даних на територію іноземної держави, органу влади іноземної держави, іноземній фізичній
            або іноземній юридичній особі.
          </p>
          <p>
            <strong>1.11</strong> Знищення персональних даних – будь-які дії, в результаті яких
            персональні дані знищуються безповоротно з неможливістю подальшого відновлення змісту
            персональних даних в інформаційній системі персональних даних і (або) внаслідок яких
            знищуються матеріальні носії персональних даних.
          </p>
          <h2>2 Загальні положення</h2>
          <p>
            <strong>2.1</strong> Дана Політика конфіденційності встановлює порядок отримання,
            зберігання, обробки, використання і розкриття Інтернет-магазином https://buy-all.store
            персональних даних Покупця та Третьої особи та застосовується до всієї інформації, яку
            Продавець може отримати про Покупця та Третю особу.
          </p>
          <p>
            <strong>2.2</strong> Безпека персональних даних, які обробляються Продавцем,
            забезпечується шляхом реалізації правових, організаційних і технічних заходів,
            необхідних для виконання в повному обсязі вимог чинного законодавства у сфері захисту
            персональних даних.
          </p>
          <p>
            <strong>2.3</strong> Покупець самостійно надає свої персональні дані при оформленні
            замовлення шляхом надання відповідей на попередньо сформульовані Продавцем питання
            анкети, розміщеної на веб-сторінці Інтернет-магазину.
          </p>
          <p>
            <strong>2.4</strong> Покупець може самостійно надавати персональні дані Третьої особи у
            процесі здійснення оформлення замовлення, відповідаючи на питання анкети, розміщеної на
            веб-сторінці Інтернет-магазину. Також Третя особа може самостійно надавати свої
            персональні дані, відповідаючи на питання анкети.
          </p>
          <p>
            <strong>2.5</strong> Забезпечення конфіденційності персональних даних – обов'язкова
            умова для отримання Продавцем доступу до персональних даних Покупця та Третьої особи.
          </p>
          <p>
            <strong>2.6</strong> Використання Покупцем та Третьою особою сайту Інтернет-магазину
            означає повну і беззастережну згоду з цією Політикою конфіденційності та умовами обробки
            їхніх персональних даних, викладених у ній.
          </p>
          <p>
            <strong>2.7</strong> У випадку незгоди з умовами Політики конфіденційності Покупець та
            Третя особа повинні припинити використання сайту Інтернет-магазину.
          </p>
          <p>
            <strong>2.8</strong> Політика конфіденційності застосовується тільки до сайту даного
            Інтернет-магазину.
          </p>
          <p>
            <strong>2.9</strong> Продавець не перевіряє достовірність персональних даних, що
            надаються Користувачем.
          </p>
          <h2>3 Персональні дані</h2>
          <p>
            <strong>3.1</strong> Продавець збирає в електронній формі персональні дані Покупця та
            Третьої особи, а саме:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.1</strong> Прізвище, ім'я,
            по-батькові.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.2</strong> Контактний телефон.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.3</strong> Електронну пошту.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.4</strong> Адресу.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.5</strong> Вік.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.6</strong> Стать.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.7</strong> Особисті фотографії.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.8</strong> Особисті уподобання (у
            сфері мистецтва, технологій, подорожей, медіа-контенту, побуту, зокрема, стилю одягу,
            хобі, звичок, ставлення до здорового способу життя тощо).
          </p>
          <p>
            <strong>3.2</strong> Інша персональна інформація надається Покупцем та Третьою особою на
            їхній розсуд.
          </p>
          <p>
            <strong>3.3 </strong>Продавець не збирає IP-адреси Покупця та Третьої особи.
          </p>
          <p>
            <strong>3.4</strong> Покупець та Третя особа можуть переглядати сторінки сайту
            https://buy-all.store, не повідомляючи про себе жодних персональних даних.
          </p>
          <h2>4 Цілі збору і обробки персональних даних</h2>
          <p>
            <strong>4.1</strong> Продавець збирає і зберігає в електронній формі тільки ті
            персональні дані, які необхідні для надання послуг із: підбору товару відповідно до
            вподобань Продавця чи Третьої особи, продажу і доставки замовлених Покупцем чи Третьою
            особою товарів.
          </p>
          <p>
            <strong>4.2</strong> Продавець збирає дані для зв'язку з Покупцем та Третьою особою, в
            тому числі подання відповідного повідомлення про надання послуги, інформування Покупця
            та Третьої особи про підтвердження замовлення, уточнення деталей замовлення, доставки
            замовленого товару, для обробки запитів і заявок від Покупця та Третьої особи, а також
            для надання доступу Покупцеві та Третій особі до сервісів, інформації та/або матеріалів,
            що містяться на сайті https://buy-all.store.
          </p>
          <p>
            <strong>4.3</strong> Продавець має право направляти Покупцеві та Третій особі
            повідомлення про нові товари, послуги, спеціальні пропозиції та різні події. Покупець та
            Третя особа завжди може відмовитися від отримання інформаційних повідомлень, направивши
            Продавцеві лист із позначкою &ldquo;Відмова від отримання повідомлень про нові товари і
            послуги та спеціальні пропозиції&ldquo; за допомогою контактної форми.
          </p>
          <p>
            <strong>4.4</strong> Обробка персональних даних Покупця та Третьої особи здійснюється
            Продавцем будь-яким законним способом без обмеження строку.
          </p>
          <p>
            <strong>4.5</strong> Оператор обробляє знеособлені дані про Покупця та Третю особу в
            разі, якщо це дозволено в налаштуваннях браузера Покупця та Третьої особи (включено зі
            збереженням файлів &ldquo;cookie&ldquo; і використанням технології JavaScript).
          </p>
          <p>
            <strong>4.6</strong> Знеособлені дані Покупця та Третьої особи, зібрані за допомогою
            сервісів Інтернет-статистики (Гугл Аналітика, Яндекс Метрика тощо), служать для збору
            інформації про дії Покупця та Третьої особи на сайті https://buy-all.store, поліпшення
            якості роботи сайту та його змісту.
          </p>
          <p>
            <strong>4.7</strong> Продавець забезпечує збереження персональних даних Покупця та
            Третьої особи і вживає всіх можливих заходів, що виключають доступ неуповноважених
            Продавцем осіб до таких персональних даних.
          </p>
          <p>
            <strong>4.8</strong> Продавець забезпечує збереження персональних даних Покупця та
            Третьої особи і вживає всіх можливих заходів, що виключають доступ неуповноважених
            Продавцем осіб до таких персональних даних.
          </p>
          <p>
            <strong>4.9</strong> Покупець та Третя особа погоджуються, що Інтернет-магазин
            https://buy-all.store має право передавати їхні персональні дані організаціям поштового
            зв'язку, службам доставки, операторам електрозв'язку виключно з метою виконання
            замовлення, оформленого на сайті Інтернет-магазину www.paki.com.ua, включаючи доставку
            товару.
          </p>
          <h2>5 Умови надання третім особам доступу до персональних даних</h2>
          <p>
            <strong>5.1</strong> Продавець не передає персональні дані Покупця та Третьої особи
            третім особам, крім випадків, визначених законодавством та цією Політикою
            конфіденційності.
          </p>
          <p>
            <strong>5.2</strong> Продавець вживає необхідних організаційних та технічних заходів для
            захисту персональної інформації Покупця та Третьої особи від неправомірного або
            випадкового доступу, знищення, перекручення, блокування, копіювання, поширення, а також
            від інших неправомірних дій третіх осіб.
          </p>
          <p>
            <strong>5.3</strong> Будь-яке поширення Продавцем отриманих персональних даних можливе
            виключно за згодою Покупця та Третьої особи.
          </p>
          <p>
            <strong>5.4 </strong> Продавець невідкладно інформує Покупця та Третю особу про втрату
            або розголошення їхніх персональних даних, якщо таке відбулося.
          </p>
          <h2>6 Зміна персональної інформації</h2>
          <p>
            <strong>6.1</strong> Покупець та Третя особа можуть у будь-який момент змінити (оновити,
            доповнити, видалити) надану ними персональну інформацію або її частин, шляхом подання
            Продавцеві відповідного повідомлення з позначкою &ldquo;Актуалізація персональних
            даних&ldquo; за допомогою контактної форми.
          </p>
          <h2>7 Транскордонна передача персональних даних</h2>
          <p>
            <strong>7.1</strong> Продавець до початку здійснення транскордонної передачі
            персональних даних зобов'язаний переконатися в тому, що іноземна держава, на територію
            якої він передбачає здійснювати передачу персональних даних Покупця та Третьої особи,
            забезпечує надійний захист прав суб'єктів персональних даних.
          </p>
          <p>
            <strong>7.2</strong> Транскордонна передача персональних даних на території іноземних
            держав, які не відповідають зазначеним вище вимогам, може здійснюватися тільки в разі
            наявності в письмовій формі згоди Покупця та Третьої особи на транскордонну передачу
            їхніх персональних даних та / або для виконання договору, стороною якого є Покупець та
            Третя особа.
          </p>
          <h2>8 Зміна політики конфіденційності</h2>
          <p>
            <strong>8.1</strong> Політика конфіденційності діє безстроково до заміни її умов новою
            версією. Продавець має право змінити умови Політики конфіденційності. У такому випадку
            буде замінена версія документа на сторінці Інтернет-магазину &ldquo;Політика
            конфіденційності&ldquo;.
          </p>
          <p>
            <strong>8.2</strong> Продавець рекомендує Покупцеві та Третій особі періодично
            переглядати умови Політики конфіденційності, яка знаходиться у вільному доступі на сайті
            Інтернет-магазину, щоб бути поінформованими про те, як Продавець захищає їхні
            персональні дані.
          </p>
          <h2>9 Інші умови</h2>
          <p>
            <strong>9.1</strong> Усі пропозиції або питання з приводу цієї Політики конфіденційності
            слід повідомляти в службу підтримки користувачів сайту https://buy-all.store за
            допомогою контактної форми.
          </p>
          <p>
            <strong>9.2</strong> Покупець та Третя особа можуть отримати будь-які роз'яснення з
            питань, що стосуються обробки їхніх персональних даних, звернувшись до Продавця за
            допомогою контактної форми.
          </p>
          <p>
            <strong>9.3</strong> Покупець та Третя особа можуть у будь-який момент відкликати свою
            згоду на обробку персональних даних, направивши Продавцеві повідомлення з позначкою
            &ldquo;Відкликання згоди на обробку персональних даних&ldquo; за допомогою контактної
            форми.
          </p>
        </div>
      </PageContainer>
    </MainLayout>
  );
};

export default Policy;

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: categories } = await api.categories.getTree();

  return {
    props: {
      categories,
    },
  };
};
