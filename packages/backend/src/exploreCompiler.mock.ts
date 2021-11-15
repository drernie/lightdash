import {
    DimensionType,
    Explore,
    FieldType,
    MetricType,
    Source,
    SupportedDbtAdapter,
} from 'common';
import { UncompiledExplore } from './exploreCompiler';

const sourceMock: Source = {
    path: '',
    content: '',
    range: {
        start: {
            line: 0,
            character: 0,
        },
        end: {
            line: 0,
            character: 0,
        },
    },
};

export const exploreBase: Explore = {
    targetDatabase: SupportedDbtAdapter.POSTGRES,
    name: '',
    tags: [],
    baseTable: 'a',
    joinedTables: [],
    tables: {},
};

export const exploreOneEmptyTable: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {},
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreOneEmptyTableCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {},
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreMissingBaseTable: UncompiledExplore = {
    ...exploreBase,
};

export const exploreMissingJoinTable: UncompiledExplore = {
    ...exploreBase,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '',
        },
    ],
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {},
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreCircularReference: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'a',
                    sql: '${a.dim1}', // circular reference
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreTableSelfReference: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreTableSelfReferenceCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    compiledSql: 'a.dim1',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreReferenceDimension: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    table: 'a',
                    sql: '${a.dim1}',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreReferenceDimensionCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    compiledSql: 'a.dim1',
                    source: sourceMock,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    table: 'a',
                    sql: '${a.dim1}',
                    compiledSql: '(a.dim1)',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};
export const exploreComplexReference: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim2',
                    table: 'a',
                    sql: '${a.dim1}',
                    source: sourceMock,
                },
                dim3: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim3',
                    table: 'a',
                    sql: '${TABLE}.dim3 + ${a.dim2} + ${dim1}',
                    source: sourceMock,
                },
            },
            metrics: {
                m1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.AVERAGE,
                    name: 'm1',
                    table: 'a',
                    sql: '${dim3}',
                    source: sourceMock,
                    isAutoGenerated: false,
                },
            },
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreComplexReferenceCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    compiledSql: 'a.dim1',
                    source: sourceMock,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim2',
                    table: 'a',
                    sql: '${a.dim1}',
                    compiledSql: '(a.dim1)',
                    source: sourceMock,
                },
                dim3: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim3',
                    table: 'a',
                    sql: '${TABLE}.dim3 + ${a.dim2} + ${dim1}',
                    compiledSql: 'a.dim3 + ((a.dim1)) + (a.dim1)',
                    source: sourceMock,
                },
            },
            metrics: {
                m1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.AVERAGE,
                    name: 'm1',
                    table: 'a',
                    sql: '${dim3}',
                    compiledSql: 'AVG((a.dim3 + ((a.dim1)) + (a.dim1)))',
                    source: sourceMock,
                    isAutoGenerated: false,
                },
            },
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreReferenceInJoin: UncompiledExplore = {
    ...exploreBase,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${b.dim1}',
        },
    ],
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
        b: {
            name: 'b',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.tableb',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'b',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    table: 'b',
                    sql: '${a.dim1}',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreReferenceInJoinCompiled: Explore = {
    ...exploreBase,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${b.dim1}',
            compiledSqlOn: '(a.dim1) = (b.dim1)',
        },
    ],
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    compiledSql: 'a.dim1',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
        b: {
            name: 'b',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.tableb',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    table: 'b',
                    sql: '${TABLE}.dim1',
                    compiledSql: 'b.dim1',
                    source: sourceMock,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    table: 'b',
                    sql: '${a.dim1}',
                    compiledSql: '(a.dim1)',
                    source: sourceMock,
                },
            },
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreWithMetricNumber: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim1',
                    table: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                },
            },
            metrics: {
                m1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.SUM,
                    name: 'm1',
                    table: 'a',
                    sql: '${dim1}',
                    source: sourceMock,
                    isAutoGenerated: false,
                },
                m2: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.NUMBER,
                    name: 'm2',
                    table: 'a',
                    sql: '2 + ${m1}',
                    source: sourceMock,
                    isAutoGenerated: false,
                },
            },
            lineageGraph: {},
            source: sourceMock,
        },
    },
};

export const exploreWithMetricNumberCompiled: Explore = {
    ...exploreWithMetricNumber,
    joinedTables: [],
    tables: {
        a: {
            name: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    ...exploreWithMetricNumber.tables.a.dimensions.dim1,
                    compiledSql: 'a.dim1',
                },
            },
            metrics: {
                m1: {
                    ...exploreWithMetricNumber.tables.a.metrics.m1,
                    compiledSql: 'SUM((a.dim1))',
                },
                m2: {
                    ...exploreWithMetricNumber.tables.a.metrics.m2,
                    compiledSql: '2 + (SUM((a.dim1)))',
                },
            },
            lineageGraph: {},
            source: sourceMock,
        },
    },
};
