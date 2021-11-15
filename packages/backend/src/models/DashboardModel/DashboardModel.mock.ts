import {
    CreateDashboard,
    CreateDashboardChartTile,
    Dashboard,
    DashboardBasicDetails,
    DashboardChartTile,
    DashboardTileTypes,
    DashboardUnversionedFields,
    DashboardVersionedFields,
} from 'common';
import {
    DashboardTable,
    DashboardTileTable,
    DashboardVersionTable,
} from '../../database/entities/dashboards';
import { SavedQueryTable } from '../../database/entities/savedQueries';
import { SpaceTable } from '../../database/entities/spaces';
import { GetChartTileQuery, GetDashboardQuery } from './DashboardModel';

// Argument mocks
const tileWithoutId: CreateDashboardChartTile = {
    type: DashboardTileTypes.SAVED_CHART,
    x: 4,
    y: 5,
    h: 100,
    w: 200,
    properties: {
        savedChartUuid: '123',
    },
};
const tileWithId: DashboardChartTile = {
    uuid: '2a93d63d-ca81-421c-b88b-1124a2f02407',
    ...tileWithoutId,
};

export const createDashboard: CreateDashboard = {
    name: 'my new dashboard',
    description: 'description',
    tiles: [tileWithoutId],
};

export const createDashboardWithTileIds: CreateDashboard = {
    ...createDashboard,
    tiles: [tileWithId],
};

export const addDashboardVersion: DashboardVersionedFields = {
    tiles: [tileWithoutId],
};

export const addDashboardVersionWithTileIds: DashboardVersionedFields = {
    tiles: [tileWithId],
};

export const addDashboardVersionWithoutChart: DashboardVersionedFields = {
    tiles: [
        {
            ...tileWithoutId,
            properties: {
                savedChartUuid: null,
            },
        },
    ],
};

export const updateDashboard: DashboardUnversionedFields = {
    name: 'my updated dashboard',
    description: 'updated description',
};

// Select mocks

export const spaceEntry: SpaceTable['base'] = {
    space_id: 0,
    space_uuid: '123',
    name: 'space name',
    created_at: new Date(),
    project_id: 0,
};
export const savedChartEntry: SavedQueryTable['base'] = {
    saved_query_id: 0,
    saved_query_uuid: '123',
    space_id: 0,
    name: 'chart name',
    created_at: new Date(),
};

export const dashboardEntry: DashboardTable['base'] = {
    dashboard_id: 0,
    dashboard_uuid: 'my_dashboard_uuid',
    name: 'name',
    description: 'description',
    space_id: 0,
    created_at: new Date(),
};

export const dashboardVersionEntry: DashboardVersionTable['base'] = {
    dashboard_version_id: 0,
    dashboard_id: 0,
    created_at: new Date(),
};

export const dashboardWithVersionEntry: GetDashboardQuery = {
    dashboard_id: dashboardEntry.dashboard_id,
    dashboard_uuid: dashboardEntry.dashboard_uuid,
    name: dashboardEntry.name,
    description: dashboardEntry.description,
    dashboard_version_id: dashboardVersionEntry.dashboard_version_id,
    created_at: dashboardVersionEntry.created_at,
};

export const dashboardTileEntry: DashboardTileTable['base'] = {
    dashboard_version_id: 0,
    dashboard_tile_uuid: '2a93d63d-ca81-421c-b88b-1124a2f02407',
    type: DashboardTileTypes.SAVED_CHART,
    x_offset: 5,
    y_offset: 5,
    height: 10,
    width: 10,
};

export const dashboardTileWithSavedChartEntry = {
    ...dashboardTileEntry,
    saved_query_uuid: '123',
};

export const dashboardChartTileEntry: GetChartTileQuery = {
    dashboard_tile_uuid: 'my-tile',
    saved_query_uuid: savedChartEntry.saved_query_uuid,
};

// Expected returns

export const expectedDashboard: Dashboard = {
    uuid: dashboardEntry.dashboard_uuid,
    name: dashboardEntry.name,
    description: dashboardEntry.description,
    updatedAt: dashboardVersionEntry.created_at,
    tiles: [
        {
            uuid: dashboardTileEntry.dashboard_tile_uuid,
            type: dashboardTileEntry.type,
            properties: {
                savedChartUuid: savedChartEntry.saved_query_uuid,
            },
            x: dashboardTileEntry.x_offset,
            y: dashboardTileEntry.y_offset,
            h: dashboardTileEntry.height,
            w: dashboardTileEntry.width,
        },
    ],
};

export const expectedAllDashboards: DashboardBasicDetails[] = [
    {
        uuid: dashboardEntry.dashboard_uuid,
        name: dashboardEntry.name,
        description: dashboardEntry.description,
        updatedAt: dashboardVersionEntry.created_at,
    },
];
