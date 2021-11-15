import {
    CreateWarehouseCredentials,
    DbtProjectConfig,
    ProjectType,
} from 'common';
import { warehouseClientFromCredentials } from '../services/warehouseClients/warehouseClientFromCredentials';
import { ProjectAdapter } from '../types';
import { DbtCloudIdeProjectAdapter } from './dbtCloudIdeProjectAdapter';
import { DbtGithubProjectAdapter } from './dbtGithubProjectAdapter';
import { DbtGitlabProjectAdapter } from './dbtGitlabProjectAdapter';
import { DbtLocalCredentialsProjectAdapter } from './dbtLocalCredentialsProjectAdapter';

export const projectAdapterFromConfig = async (
    config: DbtProjectConfig,
    warehouseCredentials: CreateWarehouseCredentials,
): Promise<ProjectAdapter> => {
    const warehouseClient =
        warehouseClientFromCredentials(warehouseCredentials);
    const configType = config.type;
    switch (config.type) {
        case ProjectType.DBT:
            return new DbtLocalCredentialsProjectAdapter({
                warehouseClient,
                projectDir: config.project_dir,
                warehouseCredentials,
            });
        case ProjectType.DBT_CLOUD_IDE:
            return new DbtCloudIdeProjectAdapter({
                warehouseClient,
                accountId: `${config.account_id}`,
                environmentId: `${config.environment_id}`,
                projectId: `${config.project_id}`,
                apiKey: config.api_key,
            });
        case ProjectType.GITHUB:
            return new DbtGithubProjectAdapter({
                warehouseClient,
                githubPersonalAccessToken: config.personal_access_token,
                githubRepository: config.repository,
                githubBranch: config.branch,
                projectDirectorySubPath: config.project_sub_path,
                warehouseCredentials,
            });
        case ProjectType.GITLAB:
            return new DbtGitlabProjectAdapter({
                warehouseClient,
                gitlabPersonalAccessToken: config.personal_access_token,
                gitlabRepository: config.repository,
                gitlabBranch: config.branch,
                projectDirectorySubPath: config.project_sub_path,
                warehouseCredentials,
            });
        default:
            const never: never = config;
            throw new Error(`Adapter not implemented for type: ${configType}`);
    }
};
