import {
    Button,
    ButtonGroup,
    Card,
    Classes,
    Dialog,
    Tag,
} from '@blueprintjs/core';
import { OrganizationUser } from 'common';
import React, { FC, useState } from 'react';
import {
    useDeleteUserMutation,
    useOrganizationUsers,
} from '../../hooks/useOrganizationUsers';
import { useApp } from '../../providers/AppProvider';

const UserListItem: FC<{ disabled: boolean; user: OrganizationUser }> = ({
    disabled,
    user: { userUuid, firstName, lastName, email },
}) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { mutate, isLoading: isDeleting } = useDeleteUserMutation();

    const handleDelete = () => mutate(userUuid);

    return (
        <Card
            elevation={0}
            style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '20px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <p style={{ margin: 0, marginRight: '10px', flex: 1 }}>
                    <b
                        className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                        style={{ margin: 0, marginRight: '10px' }}
                    >
                        {firstName} {lastName}
                    </b>
                    {email && <Tag minimal>{email}</Tag>}
                </p>
                <ButtonGroup>
                    <Button
                        icon="delete"
                        intent="danger"
                        outlined
                        onClick={() => setIsDeleteDialogOpen(true)}
                        text="Delete"
                        disabled={disabled}
                    />
                </ButtonGroup>
            </div>
            <Dialog
                isOpen={isDeleteDialogOpen}
                icon="person"
                onClose={() =>
                    !isDeleting ? setIsDeleteDialogOpen(false) : undefined
                }
                title="Delete user"
                lazy
                canOutsideClickClose={false}
            >
                <div className={Classes.DIALOG_BODY}>
                    <p>Are you sure you want to delete this user ?</p>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            disabled={isDeleting}
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isDeleting}
                            intent="danger"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Card>
    );
};

const OrganizationPanel: FC = () => {
    const { user } = useApp();
    const { data: organizationUsers } = useOrganizationUsers();

    return (
        <div
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div>
                {organizationUsers?.map((orgUser) => (
                    <UserListItem
                        key={orgUser.email}
                        user={orgUser}
                        disabled={
                            user.data?.userUuid === orgUser.userUuid ||
                            organizationUsers.length <= 1
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default OrganizationPanel;
