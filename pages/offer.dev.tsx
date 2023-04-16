import { IPageProps } from '../interfaces/page';
import React, { FC } from 'react';
import { useCategories } from '../hooks/useCategories';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import MainLayout from '../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import styles from './common-page.module.scss';
import { GetServerSideProps } from 'next';
import { api } from '../api';

const Offer: FC<IPageProps> = ({ categories }) => {
  const { allCategories } = useCategories(categories);
  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs: [
      { name: 'Головна', key: '/' },
      { name: 'Оферта', key: '' },
    ],
  };
  const metaData = {
    title: 'Оферта',
    description: 'Умови оферти.',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <h1 className={styles.heading}>Публічний договір (Оферта)</h1>
        <div className={styles.offerPage}>
          <h3>про купівлю-продаж товарів</h3>
          <p>
            Цей договір є офіційною та публічною пропозицією Продавця укласти на відстані чи поза
            торговельними або офісними приміщеннями договір купівлі-продажу товару, обраного за
            програмним алгоритмом на основі відповідей на питання анкети, розміщеної на сайті
            https://buy-all.store. Даний договір є публічним, тобто відповідно до статті 633
            Цивільного кодексу України, його умови є однаковими для всіх покупців незалежно від їх
            статусу (фізична особа, юридична особа, фізична особа-підприємець) без надання переваги
            одному покупцю перед іншим. Шляхом укладення цього Договору Покупець в повному обсязі
            приймає умови та порядок оформлення замовлення, оплати товару, доставки товару,
            повернення товару, відповідальності за недобросовісне замовлення та усі інші умови
            договору.
          </p>
          <h2>1. Визначення термінів</h2>
          <p>
            <strong>1.1</strong> Публічна оферта (далі - &ldquo;Оферта&ldquo;) - публічна пропозиція
            Продавця, адресована невизначеному колу осіб, укласти з Продавцем договір
            купівлі-продажу Товару (далі - &ldquo;Договір&ldquo;) за допомогою засобів дистанційного
            зв’язку на умовах, що містяться в цій Оферті.
          </p>
          <p>
            <strong>1.2</strong> Засоби дистанційного зв'язку – телекомунікаційні та інформаційні
            мережі, зокрема Інтернет, що використовуються для укладення Договору на відстані.
          </p>
          <p>
            <strong>1.3</strong> Інтернет-магазин – сайт Продавця за адресою https://buy-all.store,
            створений для укладення договорів роздрібної купівлі-продажу Товарів на підставі
            заповненої Покупцем чи Третьою особою анкети із складеними Продавцем питаннями.
          </p>
          <p>
            <strong>1.4</strong> Продавець (Сторона Договору) - фізична особа-підприємець
            _______________________________________ (РНОКПП ____________), місцезнаходження якої:
            _____, м. ________, вул. ____________, буд._____, що передає або зобов'язується передати
            Товар у власність Покупцеві та діє відповідно до чинного законодавства України.
          </p>
          <p>
            <strong>1.5</strong> Покупець (Сторона договору) - дієздатна фізична особа, яка досягла
            18 років, яка здійснює замовлення Товару у визначений цією Офертою спосіб, для цілей, що
            не пов'язані зі здійсненням підприємницької діяльності, приймає Товар або надає
            необхідні дані про Третю особу, а також зобов'язується сплатити визначену грошову суму
            за Товар.
          </p>
          <p>
            <strong>1.6</strong> Третя особа – дієздатна фізична особа, яка досягла 18 років, на
            користь якої Покупець здійснює оформлення замовлення, відповідаючи на питання анкети
            (надаючи персональні дані такої особи) та здійснюючи оплату Товару, або яка, отримавши
            Спеціальне посилання від Продавця, самостійно надає відповіді на питання анкети (надаючи
            свої персональні дані), та приймає Товар, не здійснюючи оплату грошової суми за нього.
          </p>
          <p>
            <strong>1.7</strong> Товар – об'єкт Договору, який обирається Продавцем за програмним
            алгоритмом на основі відповідей, наданих Покупцем чи Третьою особою шляхом заповнення
            анкети, розміщеної на сторінці Інтернет-магазину, характер та вигляд якого невідомий
            Покупцеві чи Третій особі до моменту його отримання та який відповідає вимогам
            законодавства щодо належної якості, безпеки і належного торговельного обслуговування.
          </p>
          <p>
            <strong>1.8</strong> Програмний алгоритм – спосіб визначення характеристик Товару, який
            ґрунтується на наданих Покупцем чи Третьою особою відповідях на попередньо сформульовані
            Продавцем питання анкети, розміщеної на веб-сторінці Інтернет-магазину; полягає у
            самостійному підборі Продавцем Товару відповідно до вподобань та інших вказаних
            персональних даних Покупця чи Третьої особи.
          </p>
          <p>
            <strong>1.8</strong> Спеціальне посилання – текстове посилання формату HTML на анкету з
            питаннями, яке Продавець зобов’язується надіслати за допомогою засобів дистанційного
            зв'язку Третій особі, що самостійно надаватиме відповіді на питання анкети у разі
            замовлення Товару для неї Покупцем.
          </p>
          <h2>2. Предмет договору</h2>
          <p>
            <strong>2.1</strong> Продавець зобов’язується в обумовлений Сторонами строк передати у
            власність Покупця Товар, а Покупець зобов’язується оплатити і прийняти Товар на умовах
            Договору.
          </p>
          <p>
            <strong>2.2</strong> У разі залучення до угоди Третьої особи, на користь якої Покупець
            здійснює оформлення замовлення, відповідаючи на питання анкети (надаючи персональні дані
            такої особи), Продавець зобов’язується передати у власність Третьої особи Товар,
            Покупець зобов’язується оплатити даний Товар на умовах Договору, а Третя особа
            зобов’язується прийняти даний Товар.
          </p>
          <p>
            <strong>2.3</strong> У разі залучення до угоди Третьої особи, яка самостійно надає
            відповіді на питання анкети (надаючи свої персональні дані), Продавець зобов’язується
            надіслати Спеціальне посилання Третій особі, передати у власність Третьої особи Товар,
            Покупець зобов’язується оплатити даний Товар на умовах Договору, а Третя особа
            зобов’язується прийняти даний Товар.
          </p>
          <p>
            <strong>2.4</strong> Датою укладення Договору (акцептом оферти) та моментом повного й
            беззаперечного прийняття Покупцем умов Договору вважається дата заповнення Покупцем
            анкети із запитаннями, розташованої на сайті Інтернет-магазину, за умови отримання
            Покупцем від Продавця підтвердження замовлення в електронному вигляді.
          </p>
          <p>
            <strong>2.5</strong> У разі залучення до угоди Третьої особи, що самостійно надає
            відповіді на питання щодо себе, датою укладення Договору-оферти (акцептом оферти) та
            моментом повного й беззаперечного прийняття Покупцем (та Третьою особою) умов Договору
            вважається дата заповнення Третьою особою анкети із запитаннями, розташованої на сайті
            Інтернет-магазину / дата надання Покупцем необхідних персональних даних Третьої особи за
            умови отримання Покупцем від Продавця підтвердження замовлення в електронному вигляді.
          </p>
          <h2>3. Оформлення замовлення</h2>
          <p>
            <strong>3.1</strong> Покупець здійснює оформлення замовлення Товару в Інтернет-магазині
            шляхом заповнення анкети із питаннями, яка являє собою реєстраційну форму, що на
            головній сторінці сайту Інтернет-магазину (кнопка «Реєстрація») та оплати ціни Товару.
          </p>
          <p>
            <strong>3.2</strong> При оформленні замовлення Товару на сайті Інтернет-магазину для
            себе чи на користь Третьої особи Покупець зобов'язується надати щодо себе та/або Третьої
            особи наступну обов’язкову інформацію, необхідну Продавцю для виконання замовлення:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.2.1</strong> Прізвище, ім'я,
            по-батькові.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.2.2</strong> Контактний телефон.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.2.3</strong> Електронна пошта.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.2.4</strong> Адреса.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.2.5</strong> Розмір.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3.1.6</strong> Особисті уподобання (у
            сфері мистецтва, технологій, подорожей, медіа-контенту, побуту, зокрема, стилю одягу,
            хобі тощо).
          </p>
          <p>
            <strong>3.3</strong> Покупець несе відповідальність за достовірність наданої інформації
            при оформленні замовлення Товару для себе та на користь Третьої особи, у разі її
            залучення до Договору.
          </p>
          <p>
            <strong>3.4</strong> У разі згоди Третьої особи на її залучення до Договору у якості
            Третьої особи, що самостійно надає відповіді на питання щодо себе, дана особа при
            оформленні замовлення Товару зобов'язується надати обов’язкову інформацію, необхідну
            Продавцю для виконання замовлення Товару, вказану у пункті 3.2. Оферти та нести
            відповідальність за достовірність наданої інформації.
          </p>
          <p>
            <strong>3.5</strong> Якщо будь-якій із Сторін договору чи Третій особі необхідна
            додаткова інформація, ця особа має право запросити її у іншої Сторони чи Третьої особи.
          </p>
          <p>
            <strong>3.6</strong> Замовлення вважається оформленим після оплати Покупцем ціни Товару.
          </p>
          <h2>4. Ціна і оплата товару</h2>
          <p>
            <strong>4.1</strong> Ціна на Товар визначається Покупцем самостійно та вказується ним на
            сайті Інтернет-магазину
          </p>
          <p>
            <strong>4.2</strong> Ціна на Товар визначається у гривнях без ПДВ.
          </p>
          <p>
            <strong>4.3</strong> Ціна Товару, яка вказана Покупцем на сайті Інтернет-магазину, не
            включає в себе вартість доставки Товару Покупцю чи Третій особі.
          </p>
          <p>
            <strong>4.4</strong> Оплата здійснюється через платіжну систему для прийому карт,
            визначену Продавцем на сайті Інтернет-магазину. Продавець не збирає та не зберігаєте
            дані про платіжні картки чи банківські рахунки клієнтів.
          </p>
          <p>
            <strong>4.5</strong> Покупець зобов’язаний здійснити оплату одночасно з оформленням
            замовлення (попередня оплата) шляхом нарахування коштів на банківський рахунок Продавця.
          </p>
          <p>
            <strong>4.6</strong> Зобов'язання Покупця по оплаті Товару вважаються виконаними з
            моменту надходження Продавцю коштів на його рахунок.
          </p>
          <h2>5. Права та обов'зки сторін</h2>
          <p>
            <strong>5.1</strong> Продавець зобов’язаний:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.1.1</strong> Здійснити передачу
            Товару належної якості Покупцеві чи Третій особі через службу доставки (перевізника)
            впродовж 5 календарних днів з дня оформлення замовлення.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.1.2</strong> Надіслати Спеціальне
            посилання Третій особі у разі залучення її до угоди у якості Третьої особи, яка
            самостійно надає відповіді на питання анкети.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.1.3</strong> Не розголошувати
            отриману інформацію про Покупця та Третю особу і не надавати доступ до цієї інформації
            іншим особам, за винятком випадків, передбачених законодавством та під час виконання
            замовлення Покупця.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.1.4</strong> Одночасно з Товаром
            передати Покупцеві чи Третій особі його приналежності та документи (технічний паспорт,
            сертифікат якості тощо), що стосуються Товару та підлягають переданню разом із Товаром.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.1.5</strong> Повернути сплачені
            гроші Покупцеві повністю, якщо Товар не відправлений упродовж встановленого Договором
            строку.
          </p>
          <p>
            <strong>5.2</strong> Продавець має право:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.1</strong> Змінювати умови цього
            Договору, в односторонньому порядку, розміщуючи їх на сайті Інтернет-магазину. Всі зміни
            набувають чинності з моменту їх публікації.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.2</strong> Вимагати від Покупця чи
            Третьої особи прийняти Товар, якщо дана особа без достатніх підстав зволікає з його
            прийняттям.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.3</strong> Відмовитися від
            Договору у разі недотримання Покупцем та/або Третьою особою умов Договору.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.4</strong> Змінювати перелік
            доступних для отримання Покупцем Товарів кожні три послідовні місяці року, формуючи при
            цьому новий перелік на власний розсуд.
          </p>
          <p>
            <strong>5.2</strong> Продавець має право:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.1</strong> Змінювати умови цього
            Договору, в односторонньому порядку, розміщуючи їх на сайті Інтернет-магазину. Всі зміни
            набувають чинності з моменту їх публікації.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.2</strong> Вимагати від Покупця чи
            Третьої особи прийняти Товар, якщо дана особа без достатніх підстав зволікає з його
            прийняттям.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.3</strong> Відмовитися від
            Договору у разі недотримання Покупцем та/або Третьою особою умов Договору.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.4</strong> Змінювати перелік
            доступних для отримання Покупцем Товарів кожні три послідовні місяці року, формуючи при
            цьому новий перелік на власний розсуд.
          </p>
          <p>
            <strong>5.2</strong> Продавець має право:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.1</strong> Змінювати умови цього
            Договору, в односторонньому порядку, розміщуючи їх на сайті Інтернет-магазину. Всі зміни
            набувають чинності з моменту їх публікації.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.2</strong> Вимагати від Покупця чи
            Третьої особи прийняти Товар, якщо дана особа без достатніх підстав зволікає з його
            прийняттям.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.3</strong> Відмовитися від
            Договору у разі недотримання Покупцем та/або Третьою особою умов Договору.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.2.4</strong> Змінювати перелік
            доступних для отримання Покупцем Товарів кожні три послідовні місяці року, формуючи при
            цьому новий перелік на власний розсуд.
          </p>
          <p>
            <strong>5.3</strong> Покупець зобов'язується:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.3.1</strong> До моменту укладення
            Договору ознайомитися зі змістом Оферти та Політики конфіденційності на сайті
            Інтернет-магазину.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.3.2</strong> Повідомити всі
            необхідні дані, що однозначно ідентифікують його як Покупця, а також дані Третьої особи
            у разі її залучення, достатні для виконання замовлення Продавцем.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.3.3</strong> Прийняти Товар, у разі
            здійснення оформлення замовлення Товару на свою користь, за умови сумлінного виконання
            Продавцем своїх зобов’язань.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.3.4</strong> Повністю оплатити Товар
            до його передання Продавцем Покупцеві чи Третій особі у визначений Договором спосіб та
            строк.
          </p>
          <p>
            <strong>5.4</strong> Покупець має право:
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.4.1</strong> Вимагати від Продавця
            передачі Товару, якщо Продавець без достатніх підстав зволікає з його передачею.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.4.2</strong> Вимагати від Продавця
            виконання інших зобов’язань згідно з Договором.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.4.3</strong> Повернути Товар
            неналежної якості та вимагати повернення сплачених коштів на умовах, передбачених
            Договором.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.4.4</strong> Відмовитися від
            Договору у випадку невиконання Продавцем своїх зобов’язань за Договором та вимагати
            повернення сплачених Покупцем коштів.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.4.5</strong> Самостійно обрати ціну
            Товару, яку він готовий сплатити.
          </p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>5.4.6</strong> Третя особа має такі ж
            самі права та обов’язки, що й Покупець, за винятком визначених у п.п. 5.3.1., 5.3.4.
            обов’язків.
          </p>
          <h2>6. Доставка товару</h2>
          <p>
            <strong>6.1</strong> Покупець чи Третя особа самостійно обирає службу доставки
            (перевізника) серед запропонованих Продавцем служб на сайті Інтернет-магазину.
          </p>
          <p>
            <strong>6.2</strong> Вартість доставки Товару Покупець сплачує відповідно до діючих
            тарифів служб доставки (перевізників) безпосередньо обраній ним службі доставки
            (перевізнику).
          </p>
          <p>
            <strong>6.3</strong> При отриманні товару Покупець чи Третя особа повинні у присутності
            представника служби доставки (перевізника) перевірити відповідність Товару
            характеристикам належної якості.
          </p>
          <p>
            <strong>6.4</strong> Покупець або Третя особа під час приймання Товару підтверджує своїм
            підписом в товарному чеку або в замовленні, або в транспортній накладній на доставку
            товарів, що не має претензій до Товару.
          </p>
          <p>
            <strong>6.5</strong> Право власності та ризик випадкової втрати або пошкодження Товару
            переходить до Покупця чи Третьої особи чи під час передачі Продавцем товару службі
            доставки (перевізнику), обраній Покупцем.
          </p>
          <p>
            <strong>6.6</strong> У разі пошкодження Товару службою доставки (перевізником) під час
            його транспортування, усі претензії вирішуються Покупцем чи Третьою особою безпосередньо
            з такою службою (перевізником).
          </p>
          <h2>7. Повернення товару</h2>
          <p>
            <strong>7.1</strong> Покупець має право на повернення Продавцеві непродовольчого Товару
            належної якості, якщо Товар не задовольнив його за формою, габаритами, фасоном,
            кольором, розміром або з інших причин не може бути ним використаний за призначенням.
            Покупець має право на повернення Товару належної якості протягом 14 (чотирнадцяти) днів,
            не враховуючи дня купівлі. Повернення Товару належної якості проводиться, якщо він не
            використовувався і якщо збережено його товарний вигляд, споживчі властивості, упаковка,
            пломби, ярлики, а також розрахунковий документ, виданий Покупцю за оплату Товару. Якщо
            Товар входить до затвердженого Кабінетом Міністрів України переліку товарів, що не
            підлягають поверненню, його повернення не відбувається.
          </p>
          <p>
            <strong>7.2</strong> Повернення Покупцеві вартості Товару належної якості здійснюється
            протягом 30 (тридцяти) календарних днів з моменту отримання такого Товару Продавцем за
            умови дотримання вимог, передбачених п. 7.1. Договору та чинного законодавства України.
          </p>
          <p>
            <strong>7.3</strong> Вартість Товару підлягає поверненню шляхом банківського переказу на
            рахунок Покупця.
          </p>
          <p>
            <strong>7.4</strong> Оплата послуг служби доставки (перевізника) у разі повернення
            Товару належної якості здійснюється за рахунок Покупця чи Третьої особи та Продавцем не
            відшкодовується.
          </p>
          <p>
            <strong>7.5</strong> Покупець має право на повернення Продавцеві Товару неналежної
            якості та вимагати повернення сплачених за Товар коштів, у разі, якщо істотні недоліки
            виникли з вини Продавця Товару.
          </p>
          <p>
            <strong>7.6</strong> Оплата послуг служби доставки (перевізника) у разі повернення
            Товару неналежної якості здійснюється за рахунок Продавця.
          </p>
          <p>
            <strong>7.7</strong> Розгляд вимог, передбачених Законом України «Про захист прав
            споживачів», провадиться Продавцем за умови надання Покупцем чи Третьою особою
            документів, передбачених чинним законодавством України.
          </p>
          <p>
            <strong>7.8</strong> Продавець не відповідає за недоліки Товару, які виникли після його
            передання Покупцеві чи Третій особі внаслідок порушення Покупцем чи Третьою особою
            правил користування або зберігання Товару, дій інших осіб або непереборної сили.
          </p>
          <p>
            <strong>7.9</strong> Повернення Товару, у випадках, передбачених законом та Договором,
            здійснюється за адресою Продавця, вказаною в Договорі.
          </p>
          <p>
            <strong>7.10</strong> Обмін Товару даною Офертою не передбачений.
          </p>
          <h2>8. Відповідальність</h2>
          <p>
            <strong>8.1</strong> Продавець не несе відповідальності за шкоду, заподіяну Покупцеві
            або Третій особі чи іншим особам внаслідок неналежного монтажу, використання, зберігання
            ними придбаного у Продавця Товару.
          </p>
          <p>
            <strong>8.2</strong> Продавець не несе відповідальності за неналежне, несвоєчасне
            виконання замовлення Товару і своїх зобов’язань у випадку надання Покупцем чи Третьою
            особою недостовірної або помилкової інформації.
          </p>
          <p>
            <strong>8.3</strong> Продавець і Покупець несуть відповідальність за виконання своїх
            зобов'язань відповідно до чинного законодавства України і положень цього Договору.
          </p>
          <h2>9. Форс-мажорні обставини</h2>
          <p>
            <strong>9.1</strong> Продавець звільняються від відповідальності за часткове або повне
            невиконання або неналежне виконання зобов’язань за цим Договором у разі, якщо
            невиконання або неналежне виконання зобов’язань є наслідком дії непереборної сили або
            випадку, тобто надзвичайних і невідворотних обставин, які Продавець не міг ні
            передбачити, ні запобігти розумними силами (форс-мажорні обставини), а саме: пожежі,
            повені, землетрусу, епідемії, сильного шторму, циклону, урагану, торнадо, буревію,
            повені, нагромадження снігу, ожеледі, граду, заморозків, блискавки, посухи, просідання і
            зсуву ґрунту, іншого стихійного лиха, страйку, масових безладів, антитерористичної
            операції, операції Об’єднаних сил, оголошеної та неоголошеної війни, збройного
            конфлікту, блокади, військового ембарго, дій іноземного ворога, загальної військової
            мобілізації, дій суспільного ворога, збурення, актів тероризму, диверсій, безладів,
            вторгнення, революції, заколоту, повстання, масових заворушень, введення комендантської
            години, карантину, експропріації, примусового вилучення, захоплення підприємств,
            реквізиції, громадської демонстрації, аварії, відключення електроенергії, пошкодження
            телекомунікаційних мереж, дії чи впливу дії шкідливих програм для
            електронно-обчислювальних машин, протиправних дій третіх осіб, вибуху, тривалих перерв у
            роботі транспорту, умов, регламентованих відповідними рішеннями та актами державних
            органів влади, ембарго, заборони (обмеження) експорту/імпорту, розрахунків (платежів)
            тощо, що роблять неможливим виконання Продавцем узятих на себе зобов’язань, і якщо ці
            обставини безпосередньо вплинули на виконання Продавцем узятих на себе зобов’язань. У
            такому випадку виконання зобов’язання відкладається на термін дії форс-мажорних
            обставин.
          </p>
          <p>
            <strong>9.2</strong> Продавець, якщо він підпав під дію форс-мажорних обставин та
            внаслідок цього був позбавлений можливості належним чином виконувати свої зобов’язання
            за Договором, повинен негайно, але у будь-якому разі не пізніше 3 (трьох) наступних
            робочих днів, повідомити про це Покупця. Не інформування або несвоєчасне інформування
            про дію форс-мажорних обставин, а також відсутність або несвоєчасність їх належного
            документального підтвердження позбавляє Продавця права посилатися на їх дію.
          </p>
          <p>
            <strong>9.3</strong> Дія форс-мажорних обставин повинна бути підтверджена документами,
            виданими компетентними юридичними особами приватного або публічного права України,
            міжнародними організаціями або повноважними представниками третіх осіб, що спричинили
            виникнення форс-мажору, або документом, що надається Торгово-промисловою палатою в
            Україні чи її регіональним осередком за місцезнаходженням Продавця.
          </p>
          <p>
            <strong>9.4</strong> По завершенні форс-мажорних обставин Продавець повинен виконати
            свої зобов’язання в терміни, на які було призупинено виконання зобов’язань.
          </p>
          <p>
            <strong>9.5</strong> Виникнення форс-мажорних обставин у момент порушення виконання
            Продавцем своїх зобов’язань за Договором позбавляє його права посилатися на ці
            обставини, як на підстави для звільнення від відповідальності за Договором за такі
            порушення.
          </p>
          <h2>10. Конфіденційність і захист персональних даних</h2>
          <p>
            <strong>10.1</strong> Надаючи свої персональні дані на сайті Інтернет-магазину при
            реєстрації або оформленні Замовлення, Покупець та Третя особа надають Продавцеві свою
            добровільну згоду на обробку, використання (у тому числі і передачу) своїх персональних
            даних, а також вчинення інших дій, передбачених Законом України «Про захист персональних
            даних», без обмеження терміну дії такої згоди.
          </p>
          <p>
            <strong>10.2</strong> Продавець залишає за собою право зберігати всі отримані від
            Покупця та Третьої особи дані в електронному вигляді на захищених серверах.
          </p>
          <p>
            <strong>10.3</strong> Продавець зобов'язується не розголошувати отриману від Покупця та
            Третьої особи інформацію. Не вважається порушенням надання Продавцем інформації
            контрагентам і іншим особам, що діють на підставі договору з Продавцем, в тому числі і
            для виконання зобов'язань перед Покупцем та Третьою особою, а також у випадках, коли
            розкриття такої інформації встановлено вимогами чинного законодавства України.
          </p>
          <p>
            <strong>10.4</strong> Покупець та Третя особа несуть відповідальність за підтримання
            своїх персональних даних в актуальному стані. Продавець не несе відповідальності за
            неякісне виконання або невиконання своїх зобов'язань у зв'язку з неактуальністю
            інформації про Покупця чи Третю особу або невідповідністю її дійсності.
          </p>
          <p>
            <strong>10.5</strong> Акцептуючи дану Оферту, Покупець та Третя особа одночасно
            погоджуються дотримуватися Політики конфіденційності, розміщеної на сайті
            Інтернет-магазину.
          </p>
          <h2>11. Інші умови</h2>
          <p>
            <strong>11.1</strong> Покупець та Третя особа несуть відповідальність за підтримання
            своїх персональних даних в актуальному стані. Продавець не несе відповідальності за
            неякісне виконання або невиконання своїх зобов'язань у зв'язку з неактуальністю
            інформації про Покупця чи Третю особу або невідповідністю її дійсності.
          </p>
          <p>
            <strong>11.2</strong> Усі спори, що виникають між Сторонами, вирішуються шляхом
            переговорів. У випадку недосягнення врегулювання спірного питання шляхом переговорів,
            Сторони мають право звернутися за вирішенням спору до суду за місцезнаходженням
            Продавця.
          </p>
          <p>
            <strong>11.3</strong> Зміни до Договору можуть бути внесені в порядку, передбаченому
            чинним законодавством України.
          </p>
        </div>
      </PageContainer>
    </MainLayout>
  );
};

export default Offer;

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: categories } = await api.categories.getTree();

  return {
    props: {
      categories,
    },
  };
};
