import { Field, fieldId, friendlyName, getFieldRef } from 'common';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Ace } from 'ace-builds';
import langTools from 'ace-builds/src-noconflict/ext-language_tools';
import { useExplore } from './useExplore';
import { useExplorer } from '../providers/ExplorerProvider';

const createCompleter: (fields: Ace.Completion[]) => Ace.Completer = (
    fields,
) => ({
    getCompletions: (editor, session, pos, prefix, callback) => {
        callback(null, fields);
    },
});

const mapActiveFieldsToCompletions = (
    fields: Field[],
    selectedFields: Set<string>,
    meta: string,
): Ace.Completion[] =>
    fields.reduce<Ace.Completion[]>((acc, field) => {
        if (Array.from(selectedFields).includes(fieldId(field))) {
            const technicalOption: Ace.Completion = {
                caption: `\${${getFieldRef(field)}}`,
                value: `\${${getFieldRef(field)}}`,
                meta,
                score: Number.MAX_VALUE,
            };
            const friendlyOption: Ace.Completion = {
                ...technicalOption,
                caption: `${friendlyName(field.table)} ${friendlyName(
                    field.name,
                )}`,
            };
            return [...acc, technicalOption, friendlyOption];
        }
        return [...acc];
    }, []);

export const useExplorerAceEditorCompleter = (): {
    setAceEditor: Dispatch<SetStateAction<Ace.Editor | undefined>>;
} => {
    const {
        state: { activeFields, tableName },
    } = useExplorer();
    const explore = useExplore(tableName);
    const [aceEditor, setAceEditor] = useState<Ace.Editor>();

    useEffect(() => {
        if (aceEditor && explore.data) {
            const activeExplore = explore.data;
            const fields = Object.values(activeExplore.tables).reduce<
                Ace.Completion[]
            >(
                (acc, table) => [
                    ...acc,
                    ...mapActiveFieldsToCompletions(
                        Object.values(table.metrics),
                        activeFields,
                        'Metric',
                    ),
                    ...mapActiveFieldsToCompletions(
                        Object.values(table.dimensions),
                        activeFields,
                        'Dimension',
                    ),
                ],
                [],
            );
            langTools.setCompleters([createCompleter(fields)]);
        }
        return () => {
            langTools.setCompleters([]);
        };
    }, [aceEditor, explore, activeFields]);

    return {
        setAceEditor,
    };
};
