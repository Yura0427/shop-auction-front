interface IWordDeclension {
  (num: number, textForms: [string, string, string]): string;
}

/**
 * Склонение слов в правильную форму, например 1 минута, 2 минуты, 5 минут
 * Принимает число, и массив из трех форм ['минута', 'минуты', 'минут']
 * @example
 * let minutes = 27
 * minutes = declension(minutes, ['минута', 'минуты', 'минут']) // => '27 минут'
 */
export const declension: IWordDeclension = (num, textForms) => {
  const x = Math.abs(num) % 100;
  const y = x % 10;
  if (x > 10 && x < 20) return `${num} ${textForms[2]}`;
  if (y > 1 && y < 5) return `${num} ${textForms[1]}`;
  if (y === 1) return `${num} ${textForms[0]}`;
  return `${num} ${textForms[2]}`;
};
