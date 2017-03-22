export class Sponsor {

  private static bwPath: string = '../assets/images/sponsors/bw/';
  private static colouredPath: string = '../assets/images/sponsors/coloured/';

  private current: string;
  private bw: string;
  private coloured: string;
  private url: URL;

  constructor(image: string, url: URL) {
    this.bw = Sponsor.bwPath + image;
    this.current = this.bw;

    this.coloured = Sponsor.colouredPath + image;
    this.url = url;
  }

  setToBW() {
    this.current = this.bw;
  }

  setToColoured() {
    this.current = this.coloured;
  }
}
