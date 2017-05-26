export class CommunicatorService {

  private _tool;

  setObj(tool): void {
    console.log('CommunicatorService setObj');
    this._tool = tool;
  }

  getObj() {
    return this._tool;
  }
}
