interface ColorMap {
  names: string[];
  value: string;
}

export const colorMap: ColorMap[] = [
  {
    names: ['Золотий', 'Жовтий', 'Золотой'],
    value: '#ee871a',
  },
  {
    names: ['Сірий', 'сірий'],
    value: '#333',
  },
  {
    names: ['Червоний'],
    value: '#bc0909',
  },
  {
    names: ['Синій', 'синій'],
    value: '#1a35e7',
  },
  {
    names: ['Білий'],
    value: '#fff',
  },
  {
    names: ['Чорний', 'чорний'],
    value: '#000',
  },
];

export const getColor = (name: string): string | undefined => {
  const color = colorMap.find((color) => {
    return color.names.includes(name);
  });

  if (color) {
    return color.value;
  }
};
