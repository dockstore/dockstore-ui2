/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
