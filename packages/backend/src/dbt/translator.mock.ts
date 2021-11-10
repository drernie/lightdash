import { DbtModelColumn, DbtModelNode, DimensionType } from 'common';
import { WarehouseCatalog } from '../types';

const column: DbtModelColumn = {
    name: 'myColumnName',
    meta: {},
};

export const model: DbtModelNode = {
    unique_id: 'unique_id',
    resource_type: 'resource_type',
    columns: {
        myColumnName: column,
    },
    meta: {},
    database: 'myDatabase',
    schema: 'mySchema',
    name: 'myTable',
    relation_name: 'relation_name',
    depends_on: { nodes: [] },
    root_path: 'root_path',
    patch_path: null,
};

export const warehouseSchema: WarehouseCatalog = {
    [model.database]: {
        [model.schema]: {
            [model.name]: {
                [column.name]: DimensionType.STRING,
            },
        },
    },
};

export const warehouseSchemaWithMissingTable: WarehouseCatalog = {
    [model.database]: {
        [model.schema]: {},
    },
};
export const warehouseSchemaWithMissingColumn: WarehouseCatalog = {
    [model.database]: {
        [model.schema]: {
            [model.name]: {},
        },
    },
};

export const expectedModelWithType: DbtModelNode = {
    ...model,
    columns: {
        myColumnName: { ...column, data_type: DimensionType.STRING },
    },
};
