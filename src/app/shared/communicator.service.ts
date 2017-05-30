export class CommunicatorService {

  private _tool;

  setObj(tool): void {
    this._tool = tool;
  }

  getObj() {
    return this._tool;
  }
}
