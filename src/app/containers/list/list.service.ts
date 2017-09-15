export class ListContainersService {

  /**
   * This gets the docker pull command
   *
   * @param {string} path The path of the tool (quay.io/namespace/toolname)
   * @param {string} [tagName=''] The specific version of the docker image to get
   * @returns {string} The docker pull command
   * @memberof ListContainersService
   */
  getDockerPullCmd(path: string, tagName: string = ''): string {
    let dockerPullCmd = 'docker pull ';

    // The below handles docker hub registries
    const prefix = 'registry.hub.docker.com/';
    if (path.indexOf(prefix) !== -1) {
      path = path.replace(prefix, '');
    }

    // Not sure what this handles
    if (path.indexOf('_/') !== -1) {
      path = path.replace('_/', '');
    }

    dockerPullCmd += path;
    if (tagName) {
      dockerPullCmd += ':' + tagName;
    }
    return dockerPullCmd;
  }

}
