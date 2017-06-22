export class Tool {
    scrProvider: string;
    gitPath: string;
    default_dockerfile_path: string;
    default_cwl_path: string;
    default_wdl_path: string;
    default_cwl_test_parameter_file: string;
    default_wdl_test_parameter_file: string;
    irProvider: string;
    imagePath: string;
    private_access: boolean;
    tool_maintainer_email: string;
    toolname: string;

    constructor(
        scrProvider?: string,
        gitPath?: string,
        default_dockerfile_path?: string,
        default_cwl_path?: string,
        default_wdl_path?: string,
        default_cwl_test_parameter_file?: string,
        default_wdl_test_parameter_file?: string,
        irProvider?: string,
        imagePath?: string,
        private_access?: boolean,
        tool_maintainer_email?: string,
        toolname?: string) {
        this.scrProvider = scrProvider;
        this.gitPath = gitPath;
        this.default_dockerfile_path = default_dockerfile_path;
        this.default_cwl_path = default_cwl_path;
        this.default_wdl_path = default_wdl_path;
        this.default_cwl_test_parameter_file = default_cwl_test_parameter_file;
        this.default_wdl_test_parameter_file = default_wdl_test_parameter_file;
        this.irProvider = irProvider;
        this.imagePath = imagePath;
        this.private_access = private_access;
        this.tool_maintainer_email = tool_maintainer_email;
        this.toolname = toolname;
    }
}
