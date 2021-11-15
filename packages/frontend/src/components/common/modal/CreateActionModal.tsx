import { ApiError } from 'common';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UseMutationResult } from 'react-query';
import ActionModal, { ActionModalProps, ActionTypeModal } from './ActionModal';

type CreateActionModalProps<T> = {
    useCreate: UseMutationResult<any, ApiError, any, unknown>;
    isOpen: boolean;
    ModalContent: (
        props: Pick<ActionModalProps<T>, 'useActionModalState' | 'isDisabled'>,
    ) => JSX.Element;
    setFormValues?: (data: any, methods: UseFormReturn<any, object>) => void;
    savedData?: any;
    onClose?: () => void;
};

const CreateActionModal = <T extends { uuid: string; name: string }>(
    props: CreateActionModalProps<T>,
) => {
    const [actionState, setActionState] = useState<{
        actionType: number;
        data?: any;
    }>({
        actionType: ActionTypeModal.CLOSE,
    });
    const {
        useCreate,
        setFormValues,
        savedData,
        isOpen,
        onClose,
        ModalContent,
    } = props;
    const { status, mutate, isLoading: isCreating, reset } = useCreate;

    useEffect(() => {
        if (!isCreating) {
            reset();
        }
    }, [isCreating, reset]);

    const onSubmitForm = (data?: any) => mutate({ ...savedData, ...data });

    useEffect(() => {
        setActionState({
            actionType: !isOpen
                ? ActionTypeModal.CLOSE
                : ActionTypeModal.UPDATE,
        });
    }, [isOpen]);

    return (
        <ActionModal
            title="Create"
            confirmButtonLabel="Create"
            useActionModalState={[actionState, setActionState]}
            isDisabled={isCreating}
            onSubmitForm={onSubmitForm}
            setFormValues={setFormValues}
            completedMutation={status === 'success'}
            ModalContent={ModalContent}
            onClose={onClose}
        />
    );
};

CreateActionModal.defaultProps = {
    savedData: {},
    onClose: () => {},
    setFormValues: () => {},
};

export default CreateActionModal;
