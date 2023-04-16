import axios from 'axios';

export const getColorsPictures = async (colors: { colorsNames: string[] }) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_REACT_APP_ROOT}/colors-pictures/`, {
    params: { colors: colors.colorsNames },
  });
  return data;
};
