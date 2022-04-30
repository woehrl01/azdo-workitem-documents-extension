import sharedStyle from '../SharedStyle';
import { ColumnMore, ITableColumn } from 'azure-devops-ui/Table';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { DropdownCell } from './Controls/DropdownCell';
import { InputCell } from './Controls/InputCell';
import { IReadonlyObservableValue, ObservableValue } from 'azure-devops-ui/Core/Observable';
import { ITableItem } from './types';
import { isValidRule } from 'services/Rules';


const ruleTypeItems = [
    {
        id: 'allow',
        text: 'Allow',
        iconProps: { iconName: 'Accept', className: sharedStyle.allowed }
    },
    {
        id: 'block',
        text: 'Block',
        iconProps: { iconName: 'Blocked', className: sharedStyle.blocked }
    }
];

export const columns = (onDelete: (target: ITableItem) => void, onChange: (rowIndex: number, target: ITableItem) => void): ITableColumn<ITableItem>[] => {
    return [
        new InputCell({
            id: 'rule',
            name: 'Rule (Regular Expression)',
            width: -60,
            onEdit: onChange,
            hasError: (value: string) => !isValidRule(value),
            hasErrorMessage: 'Invalid regular expression'
        }),
        new DropdownCell({
            id: 'type',
            name: 'Type',
            width: -30,
            onEdit: onChange,
            items: ruleTypeItems
        }),
        new ColumnMore(target => {
            return {
                id: 'sub-menu',
                items: [
                    {
                        id: 'delete',
                        text: 'Delete',
                        iconProps: { iconName: 'Delete' },
                        onActivate: () => onDelete(target)
                    },
                ],
            };
        }) as ITableColumn<ITableItem>,
    ];
};

export function buildTableItems(isLoading: boolean, rules: ITableItem[]): ArrayItemProvider<IReadonlyObservableValue<ITableItem | undefined>> | ArrayItemProvider<ITableItem> {
    if (isLoading) {
        /* we return an undefined list, which renders a 'loading' row */
        return new ArrayItemProvider<IReadonlyObservableValue<ITableItem | undefined>>(
            new Array(3).fill(new ObservableValue<ITableItem | undefined>(undefined)));
    }
    return new ArrayItemProvider<ITableItem>(rules);
}
