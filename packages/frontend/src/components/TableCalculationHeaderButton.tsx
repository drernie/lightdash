import {
    Button,
    Icon,
    Menu,
    MenuItem,
    PopoverPosition,
} from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { TableCalculation } from 'common';
import React, { FC, useState } from 'react';
import { useTracking } from '../providers/TrackingProvider';
import { EventName } from '../types/Events';
import {
    DeleteTableCalculationModal,
    UpdateTableCalculationModal,
} from './TableCalculationModal';

const TableCalculationHeaderButton: FC<{
    tableCalculation: TableCalculation;
}> = ({ tableCalculation }) => {
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean>();
    const { track } = useTracking();

    return (
        <div style={{ float: 'right' }}>
            <Popover2
                isOpen={isOpen === undefined ? false : isOpen}
                onInteraction={setIsOpen}
                content={
                    <Menu>
                        <MenuItem
                            icon={<Icon icon="edit" />}
                            text="Edit"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowUpdate(true);
                                setIsOpen(false);
                                track({
                                    name: EventName.EDIT_TABLE_CALCULATION_BUTTON_CLICKED,
                                });
                            }}
                        />
                        <MenuItem
                            icon={<Icon icon="delete" />}
                            text="Delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDelete(true);
                                setIsOpen(false);
                                track({
                                    name: EventName.DELETE_TABLE_CALCULATION_BUTTON_CLICKED,
                                });
                            }}
                        />
                    </Menu>
                }
                position={PopoverPosition.BOTTOM_LEFT}
                lazy
            >
                <Tooltip2 content="View options">
                    <Button
                        minimal
                        small
                        icon="cog"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen((value) => !value);
                        }}
                        style={{
                            minHeight: 'auto',
                            minWidth: 'auto',
                        }}
                    />
                </Tooltip2>
            </Popover2>
            {showUpdate && (
                <UpdateTableCalculationModal
                    isOpen
                    tableCalculation={tableCalculation}
                    onClose={() => setShowUpdate(false)}
                />
            )}
            {showDelete && (
                <DeleteTableCalculationModal
                    isOpen
                    tableCalculation={tableCalculation}
                    onClose={() => setShowDelete(false)}
                />
            )}
        </div>
    );
};

export default TableCalculationHeaderButton;
