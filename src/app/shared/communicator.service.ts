export class CommunicatorService {

  private _tool;
  private _workflow;
  private _public = false;

  setTool(tool): void {
    this._tool = tool;
  }
  setWorkflow(workflow): void {
    this._workflow = workflow;
  }
  getTool() {
    return this._tool;
  }
  getWorkflow() {
    return this._workflow;
  }
  getisPublic() {
    return this._public;
  }
}
