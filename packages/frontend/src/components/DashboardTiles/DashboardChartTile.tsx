import React, { FC, useEffect, useRef, useState } from 'react';
import {
    DashboardChartTile as IDashboardChartTile,
    DBChartTypes,
    SavedQuery,
} from 'common';
import { useParams } from 'react-router-dom';
import EChartsReact from 'echarts-for-react';
import {
    Button,
    Card,
    Classes,
    Divider,
    H5,
    Menu,
    MenuItem,
    NonIdealState,
    PopoverPosition,
} from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { useSavedQuery } from '../../hooks/useSavedQuery';
import { SimpleChart } from '../SimpleChart';
import { useChartConfig } from '../../hooks/useChartConfig';
import { useSavedChartResults } from '../../hooks/useQueryResults';

const ValidDashboardChartTile: FC<{ data: SavedQuery }> = ({ data }) => {
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const chartRef = useRef<EChartsReact>(null);
    const queryResults = useSavedChartResults(projectUuid, data);
    const chartConfig = useChartConfig(
        data.tableName,
        queryResults.data,
        data?.chartConfig.seriesLayout,
    );
    const [activeVizTab, setActiveVizTab] = useState<DBChartTypes>(
        DBChartTypes.COLUMN,
    );

    useEffect(() => {
        if (data?.chartConfig.chartType) {
            setActiveVizTab(data.chartConfig.chartType);
        }
    }, [data]);

    return (
        <SimpleChart
            isLoading={queryResults.isLoading}
            chartRef={chartRef}
            chartType={activeVizTab}
            chartConfig={chartConfig}
        />
    );
};

const InvalidDashboardChartTile: FC = () => (
    <NonIdealState
        title="No chart available"
        description="Chart might have been deleted or you don't have permissions to see it."
        icon="search"
    />
);

type Props = {
    tile: IDashboardChartTile;
    onDelete: () => void;
};

const DashboardChartTile: FC<Props> = ({
    tile: {
        properties: { savedChartUuid },
    },
    onDelete,
}) => {
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const { data, isLoading } = useSavedQuery({
        id: savedChartUuid || undefined,
    });

    return (
        <Card
            style={{ height: '100%' }}
            className={isLoading ? Classes.SKELETON : undefined}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
                <H5 style={{ margin: 0 }}>{data?.name}</H5>
                <Popover2
                    className="non-draggable"
                    content={
                        <Menu>
                            {savedChartUuid !== null && (
                                <MenuItem
                                    icon="document-open"
                                    text="Open in explorer"
                                    href={`/projects/${projectUuid}/saved/${savedChartUuid}`}
                                />
                            )}
                            <MenuItem
                                icon="delete"
                                intent="danger"
                                text="Remove tile"
                                onClick={onDelete}
                            />
                        </Menu>
                    }
                    position={PopoverPosition.BOTTOM_RIGHT}
                    lazy
                >
                    <Tooltip2 content="Chart configuration">
                        <Button minimal icon="more" />
                    </Tooltip2>
                </Popover2>
            </div>
            <Divider />
            {data ? (
                <ValidDashboardChartTile data={data} />
            ) : (
                <InvalidDashboardChartTile />
            )}
        </Card>
    );
};

export default DashboardChartTile;
