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
import { ChartConfigOptions } from '../ChartConfigPanel';
import { ChartDownloadOptions } from '../ChartDownload';
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
    const isChartEmpty: boolean = !chartConfig.plotData;

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 20,
                }}
            >
                <H5 style={{ margin: 0 }}>{data.name}</H5>
                <Popover2
                    content={
                        <Menu>
                            <MenuItem
                                text="Change layout to"
                                icon="timeline-bar-chart"
                            >
                                <MenuItem
                                    text="Column"
                                    active={
                                        activeVizTab === DBChartTypes.COLUMN
                                    }
                                    icon="timeline-bar-chart"
                                    onClick={() =>
                                        setActiveVizTab(DBChartTypes.COLUMN)
                                    }
                                    disabled={isChartEmpty}
                                />
                                <MenuItem
                                    text="Bar"
                                    active={activeVizTab === DBChartTypes.BAR}
                                    icon="horizontal-bar-chart"
                                    onClick={() =>
                                        setActiveVizTab(DBChartTypes.BAR)
                                    }
                                    disabled={isChartEmpty}
                                />
                                <MenuItem
                                    text="Line"
                                    active={activeVizTab === DBChartTypes.LINE}
                                    icon="timeline-line-chart"
                                    onClick={() =>
                                        setActiveVizTab(DBChartTypes.LINE)
                                    }
                                    disabled={isChartEmpty}
                                />
                                <MenuItem
                                    text="Scatter"
                                    active={
                                        activeVizTab === DBChartTypes.SCATTER
                                    }
                                    icon="scatter-plot"
                                    onClick={() =>
                                        setActiveVizTab(DBChartTypes.SCATTER)
                                    }
                                    disabled={isChartEmpty}
                                />
                            </MenuItem>
                            <MenuItem
                                icon="settings"
                                text="Configure"
                                disabled={isChartEmpty}
                            >
                                <div style={{ padding: 5 }}>
                                    <ChartConfigOptions
                                        chartConfig={chartConfig}
                                    />
                                </div>
                            </MenuItem>
                            <MenuItem
                                icon="export"
                                text="Export as"
                                disabled={isChartEmpty}
                            >
                                <div style={{ padding: 5 }}>
                                    <ChartDownloadOptions chartRef={chartRef} />
                                </div>
                            </MenuItem>
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
            <SimpleChart
                isLoading={queryResults.isLoading}
                chartRef={chartRef}
                chartType={activeVizTab}
                chartConfig={chartConfig}
            />
        </>
    );
};

const InvalidDashboardChartTile: FC = () => (
    <NonIdealState
        title="No chart available"
        description="Chart might have been deleted or you don't have permissions to see it."
        icon="search"
    />
);

export enum TileMode {
    VIEW,
    EDIT,
}

type Props = {
    tile: IDashboardChartTile;
    mode: TileMode;
    onEditClick: (tile: IDashboardChartTile) => void;
};

const DashboardChartTile: FC<Props> = ({ tile, mode, onEditClick }) => {
    const { data, isLoading } = useSavedQuery({
        id: tile.properties.savedChartUuid || undefined,
    });

    return (
        <Card
            style={{ width: 500, margin: 20 }}
            className={isLoading ? Classes.SKELETON : undefined}
        >
            <Popover2
                targetTagName="div"
                position={PopoverPosition.TOP}
                content={
                    <div style={{ padding: 10 }}>
                        <Button
                            icon="edit"
                            text="Edit tile"
                            onClick={() => onEditClick(tile)}
                        />
                    </div>
                }
                lazy
                interactionKind="hover"
                disabled={mode !== TileMode.EDIT}
            >
                {data ? (
                    <ValidDashboardChartTile data={data} />
                ) : (
                    <InvalidDashboardChartTile />
                )}
            </Popover2>
        </Card>
    );
};

export default DashboardChartTile;
