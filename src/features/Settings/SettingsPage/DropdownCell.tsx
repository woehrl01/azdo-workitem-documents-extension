import styles from './style.module.scss';
import { ITableColumn, SimpleTableCell } from 'azure-devops-ui/Table';
import { Dropdown } from 'azure-devops-ui/Dropdown';
import { DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { ChangeHandler, ITableItem } from './component';

export class DropdownCell {
    private onChange: ChangeHandler;
    public id: string;
    public width: number;
    public name: string;
    public constructor(id: string, name: string, width: number, onChange: ChangeHandler) {
        this.onChange = onChange;
        this.id = id;
        this.width = width;
        this.name = name;
    }

    public renderCell(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<ITableItem>, tableItem: ITableItem, _ariaRowIndex?: number): JSX.Element {
        const setValue = (val: string): void => {
            const newItem = { ...tableItem, [tableColumn.id]: val };
            this.onChange(rowIndex, newItem);
        };

        const selection = new DropdownSelection();
        selection.select(tableItem[tableColumn.id]);

        const items = [
            {
                id: '0',
                text: 'Allow',
                iconProps: { iconName: 'Accept', className: styles.allowed }
            },
            {
                id: '1',
                text: 'Block',
                iconProps: { iconName: 'Blocked', className: styles.blocked }
            }
        ];

        return <SimpleTableCell key={'col-' + columnIndex}
            columnIndex={columnIndex}
            tableColumn={tableColumn}
        >
            <Dropdown
                ariaLabel="Basic"
                className="example-dropdown"
                placeholder="Select an Option"
                items={items}
                onSelect={(_, item): void => setValue(item.id)}
                enforceSingleSelect={true}
                minCalloutWidth={150}
                selection={selection} />
        </SimpleTableCell>;
    }
}
