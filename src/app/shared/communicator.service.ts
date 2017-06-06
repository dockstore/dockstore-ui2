export class CommunicatorService {

  private _tool;
  private _workflow;

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
}
