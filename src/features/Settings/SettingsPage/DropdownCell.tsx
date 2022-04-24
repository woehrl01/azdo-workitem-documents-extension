import { ITableColumn, SimpleTableCell } from 'azure-devops-ui/Table';
import { Dropdown } from 'azure-devops-ui/Dropdown';
import { DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { ChangeHandler, ITableItem } from './types';
import { IListBoxItem } from 'azure-devops-ui/ListBox';

type DropdownCellProps = {
    id: string;
    name: string;
    width: number;
    onChange: ChangeHandler;
    // eslint-disable-next-line @typescript-eslint/ban-types
    items: IListBoxItem<{}>[];
}
export class DropdownCell {
    private onChange: ChangeHandler;
    public id: string;
    public width: number;
    public name: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    private items: IListBoxItem<{}>[];
    public constructor({ id, name, width, onChange, items }: DropdownCellProps) {
        this.onChange = onChange;
        this.id = id;
        this.width = width;
        this.name = name;
        this.items = items;
    }

    public renderCell(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<ITableItem>, tableItem: ITableItem, _ariaRowIndex?: number): JSX.Element {
        const setValue = (val: string): void => {
            const newItem = { ...tableItem, [tableColumn.id]: val };
            this.onChange(rowIndex, newItem);
        };

        const selection = new DropdownSelection();
        selection.select(this.items.findIndex(item => item.id === tableItem[tableColumn.id]));

        return <SimpleTableCell key={'col-' + columnIndex}
            columnIndex={columnIndex}
            tableColumn={tableColumn}
        >
            <Dropdown
                ariaLabel="Basic"
                className="example-dropdown"
                placeholder="Select an Option"
                items={this.items}
                onSelect={(_, item): void => setValue(item.id)}
                enforceSingleSelect={true}
                minCalloutWidth={150}
                selection={selection} />
        </SimpleTableCell>;
    }
}
