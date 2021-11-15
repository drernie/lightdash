import {
    Colors,
    Divider,
    H3,
    Menu,
    MenuDivider,
    NonIdealState,
    Spinner,
} from '@blueprintjs/core';
import React, { FC, useMemo } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import Content from '../components/common/Page/Content';
import PageBase from '../components/common/Page/PageBase';
import Sidebar from '../components/common/Page/Sidebar';
import RouterMenuItem from '../components/common/RouterMenuItem';
import { UpdateProjectConnection } from '../components/ProjectConnection';
import ProjectTablesConfiguration from '../components/ProjectTablesConfiguration/ProjectTablesConfiguration';
import { useProject } from '../hooks/useProject';

const ProjectSettings: FC = () => {
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const { isLoading, data, error } = useProject(projectUuid);

    const basePath = useMemo(
        () => `/projects/${projectUuid}/settings`,
        [projectUuid],
    );

    if (error) {
        return (
            <div style={{ marginTop: '20px' }}>
                <NonIdealState
                    title="Error loading project"
                    description={error.error.message}
                />
            </div>
        );
    }

    if (isLoading || !data) {
        return (
            <div style={{ marginTop: '20px' }}>
                <NonIdealState title="Loading project" icon={<Spinner />} />
            </div>
        );
    }
    return (
        <PageBase>
            <Sidebar title="Project settings">
                <Menu>
                    <RouterMenuItem
                        text="Project connections"
                        exact
                        to={basePath}
                    />
                    <MenuDivider />
                    <RouterMenuItem
                        text="Tables configuration"
                        exact
                        to={`${basePath}/tablesConfiguration`}
                    />
                </Menu>
            </Sidebar>
            <Content>
                <Switch>
                    <Route
                        exact
                        path="/projects/:projectUuid/settings/tablesConfiguration"
                    >
                        <H3 style={{ marginTop: 10, marginBottom: 0 }}>
                            Configure you tables
                        </H3>
                        <Divider style={{ margin: '20px 0' }} />
                        <p style={{ marginBottom: 20, color: Colors.GRAY1 }}>
                            Pick the dbt models you want to appear as tables in
                            Lightdash
                        </p>
                        <ProjectTablesConfiguration projectUuid={projectUuid} />
                    </Route>
                    <Route exact path="/projects/:projectUuid/settings">
                        <H3 style={{ marginTop: 10, marginBottom: 0 }}>
                            Edit your project connections
                        </H3>
                        <Divider style={{ margin: '20px 0' }} />
                        <UpdateProjectConnection projectUuid={projectUuid} />
                    </Route>
                    <Redirect to={basePath} />
                </Switch>
            </Content>
        </PageBase>
    );
};

export default ProjectSettings;
