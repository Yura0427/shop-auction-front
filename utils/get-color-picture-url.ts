import { IColororsPictures } from '../interfaces/colorsPictures.interface';
import apiUrl from '../api/config';

export const getColorPictureUrl = (color: string, colorsArr: IColororsPictures[]) => {
  let pictureSrc: string[] = [];
  let files: string[] = [];
  colorsArr.forEach((elem) => {
    if (elem.colorName === color) {
      if (elem.colorFile?.length) {
        files.push(...elem.colorFile);
      } else if (elem.hexColor) {
        files.push(elem.hexColor);
      } else return;
    }
  });
  files.forEach((elem, index) => {
    if (!elem.split('.')[1]) {
      pictureSrc.push(elem);
    } else {
      if (files.length > 1 && index !== files.length - 1) {
        pictureSrc.push(`url('${apiUrl}/static/uploads/colors/${elem}') repeat-y ${index * 10}%`);
      } else if (color === 'Білий') {
        pictureSrc.push('#ffffff');
      } else {
        pictureSrc.push(`url('${apiUrl}/static/uploads/colors/${elem}')`);
      }
    }
  });
  return pictureSrc.join(',');
};
