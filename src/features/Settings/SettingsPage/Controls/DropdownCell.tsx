import { ITableColumn, SimpleTableCell } from 'azure-devops-ui/Table';
import { Dropdown } from 'azure-devops-ui/Dropdown';
import { DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { CustomEditCell, CustomEditCellProps } from './CustomEditCell';
import { NoProps } from 'components/Common';

interface DropdownCellProps<T> extends CustomEditCellProps<T> {
    items: IListBoxItem<NoProps>[];
}
export class DropdownCell<T> extends CustomEditCell<T> {
    private items: IListBoxItem<NoProps>[];
    constructor(props: DropdownCellProps<T>) {
        super(props);
        this.items = props.items;
    }

    public renderCell(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<T>, tableItem: T, _ariaRowIndex?: number): JSX.Element {
        const selection = new DropdownSelection();
        selection.select(this.items.findIndex(item => item.id === tableItem[tableColumn.id]));

        return <SimpleTableCell key={'col-' + columnIndex}
            columnIndex={columnIndex}
            tableColumn={tableColumn}
        >
            <Dropdown
                ariaLabel={this.name}
                items={this.items}
                onSelect={(_, item): void => this.setValue(rowIndex, tableItem, item.id)}
                enforceSingleSelect={true}
                minCalloutWidth={150}
                selection={selection} />
        </SimpleTableCell>;
    }
}
