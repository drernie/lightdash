import { analytics } from '../../analytics/client';
import { dashboardModel } from '../../models/models';
import { DashboardService } from './DashboardService';
import {
    createDashboard,
    createDashboardWithTileIds,
    dashboard,
    dashboardsDetails,
    space,
    updateDashboard,
    updateDashboardDetailsAndTiles,
    updateDashboardTiles,
    updateDashboardTilesWithIds,
    user,
} from './DashboardService.mock';

jest.mock('../../analytics/client', () => ({
    analytics: {
        track: jest.fn(),
    },
}));

jest.mock('../../database/database', () => ({}));

jest.mock('../../database/entities/spaces', () => ({
    getSpace: jest.fn(async () => space),
}));

jest.mock('../../models/models', () => ({
    dashboardModel: {
        getAllByProject: jest.fn(async () => dashboardsDetails),

        getById: jest.fn(async () => dashboard),

        create: jest.fn(async () => dashboard.uuid),

        update: jest.fn(),

        delete: jest.fn(),

        addVersion: jest.fn(),
    },
}));

describe('DashboardService', () => {
    const projectUuid = 'projectUuid';
    const { uuid: dashboardUuid } = dashboard;
    const service = new DashboardService({
        dashboardModel,
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('should get dashboard by uuid', async () => {
        const result = await service.getById(user, dashboard.uuid);

        expect(result).toEqual(dashboard);
        expect(dashboardModel.getById).toHaveBeenCalledTimes(1);
        expect(dashboardModel.getById).toHaveBeenCalledWith(dashboard.uuid);
    });
    test('should get all dashboard by project uuid', async () => {
        const result = await service.getAllByProject(user, projectUuid);

        expect(result).toEqual(dashboardsDetails);
        expect(dashboardModel.getAllByProject).toHaveBeenCalledTimes(1);
        expect(dashboardModel.getAllByProject).toHaveBeenCalledWith(
            projectUuid,
        );
    });
    test('should create dashboard', async () => {
        const result = await service.create(user, projectUuid, createDashboard);

        expect(result).toEqual(dashboard);
        expect(dashboardModel.create).toHaveBeenCalledTimes(1);
        expect(dashboardModel.create).toHaveBeenCalledWith(
            space.space_uuid,
            createDashboard,
        );
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'dashboard.created',
            }),
        );
    });
    test('should create dashboard with tile ids', async () => {
        const result = await service.create(
            user,
            projectUuid,
            createDashboardWithTileIds,
        );

        expect(result).toEqual(dashboard);
        expect(dashboardModel.create).toHaveBeenCalledTimes(1);
        expect(dashboardModel.create).toHaveBeenCalledWith(
            space.space_uuid,
            createDashboardWithTileIds,
        );
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'dashboard.created',
            }),
        );
    });
    test('should update dashboard details', async () => {
        const result = await service.update(
            user,
            dashboardUuid,
            updateDashboard,
        );

        expect(result).toEqual(dashboard);
        expect(dashboardModel.update).toHaveBeenCalledTimes(1);
        expect(dashboardModel.update).toHaveBeenCalledWith(
            dashboardUuid,
            updateDashboard,
        );
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'dashboard.updated',
            }),
        );
    });
    test('should update dashboard version', async () => {
        const result = await service.update(
            user,
            dashboardUuid,
            updateDashboardTiles,
        );

        expect(result).toEqual(dashboard);
        expect(dashboardModel.addVersion).toHaveBeenCalledTimes(1);
        expect(dashboardModel.addVersion).toHaveBeenCalledWith(
            dashboardUuid,
            updateDashboardTiles,
        );
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'dashboard_version.created',
            }),
        );
    });
    test('should update dashboard version with tile ids', async () => {
        const result = await service.update(
            user,
            dashboardUuid,
            updateDashboardTilesWithIds,
        );

        expect(result).toEqual(dashboard);
        expect(dashboardModel.addVersion).toHaveBeenCalledTimes(1);
        expect(dashboardModel.addVersion).toHaveBeenCalledWith(
            dashboardUuid,
            updateDashboardTilesWithIds,
        );
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'dashboard_version.created',
            }),
        );
    });
    test('should update dashboard details & version', async () => {
        const result = await service.update(
            user,
            dashboardUuid,
            updateDashboardDetailsAndTiles,
        );

        expect(result).toEqual(dashboard);
        expect(dashboardModel.update).toHaveBeenCalledTimes(1);
        expect(dashboardModel.update).toHaveBeenCalledWith(
            dashboardUuid,
            updateDashboard,
        );
        expect(dashboardModel.addVersion).toHaveBeenCalledTimes(1);
        expect(dashboardModel.addVersion).toHaveBeenCalledWith(
            dashboardUuid,
            updateDashboardTiles,
        );
        expect(analytics.track).toHaveBeenCalledTimes(2);
        expect(analytics.track).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                event: 'dashboard.updated',
            }),
        );
        expect(analytics.track).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                event: 'dashboard_version.created',
            }),
        );
    });
    test('should delete dashboard', async () => {
        await service.delete(user, dashboardUuid);

        expect(dashboardModel.delete).toHaveBeenCalledTimes(1);
        expect(dashboardModel.delete).toHaveBeenCalledWith(dashboardUuid);
        expect(analytics.track).toHaveBeenCalledTimes(1);
        expect(analytics.track).toHaveBeenCalledWith(
            expect.objectContaining({
                event: 'dashboard.deleted',
            }),
        );
    });
});
