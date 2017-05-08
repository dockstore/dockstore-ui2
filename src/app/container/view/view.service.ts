export class ViewService {

  getSizeString(size: number) {
    let sizeStr = '';

    if (size) {
      const exp = Math.log(size) / Math.log(2);
      if (exp < 10) {
        sizeStr = size.toFixed(2) + ' bytes';
      } else if (exp < 20) {
        sizeStr = (size / Math.pow(2, 10)).toFixed(2) + ' kB';
      } else if (exp < 30) {
        sizeStr = (size / Math.pow(2, 20)).toFixed(2) + ' MB';
      } else if (exp < 40) {
        sizeStr = (size / Math.pow(2, 30)).toFixed(2) + ' GB';
      }
    }

    return sizeStr;
  }

}
