import { Button } from '@blueprintjs/core';
import {
    BooleanFilter,
    DateAndTimestampFilter,
    friendlyName,
    NumberFilter,
    StringFilter,
} from 'common';
import React, { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Filter =
    | NumberFilter
    | StringFilter
    | DateAndTimestampFilter
    | BooleanFilter;
export const assertFilterId = <T extends Filter>(
    filter: T,
): T & { id: string } => {
    const { id } = filter;
    if (id !== undefined) {
        return { ...filter, id };
    }
    return { ...filter, id: uuidv4() };
};

type FilterRowProps = {
    isFirst: boolean;
    isLast: boolean;
    tableName: string;
    fieldName: string;
    onAdd: () => void;
    onDelete: () => void;
    children: ReactNode;
};

const FilterRow = ({
    isFirst,
    isLast,
    tableName,
    fieldName,
    onAdd,
    children,
    onDelete,
}: FilterRowProps) => {
    const header = (
        <span>
            {friendlyName(tableName)} <b>{friendlyName(fieldName)}</b>
        </span>
    );
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            <div style={{ flex: '0 0 300px' }}>{isFirst && header}</div>
            <div
                style={{
                    maxWidth: '400px',
                    flex: '1 0 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}
            >
                {children}
            </div>
            <div
                style={{
                    flex: '0 0 70px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                }}
            >
                <Button minimal icon="cross" onClick={onDelete} />
                {isLast && <Button minimal icon="plus" onClick={onAdd} />}
            </div>
        </div>
    );
};

export default FilterRow;
