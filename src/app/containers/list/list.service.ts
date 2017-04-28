export class ListContainersService {

  getDockerPullCmd(path: string, tagName: string = ''): string {
    let dockerPullCmd = 'docker pull ';
    const prefix = 'registry.hub.docker.com/';
    if (path.indexOf(prefix) !== -1) {
      path = path.replace(prefix, '');
    }
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
