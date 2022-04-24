import { TextField, TextFieldWidth } from 'azure-devops-ui/TextField';
import styles from './style.module.scss';
import { ITableColumn, SimpleTableCell } from 'azure-devops-ui/Table';
import { ChangeHandler, ITableItem } from './component';

export class InputCell {
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
            tableItem[tableColumn.id] = val;
            this.onChange(rowIndex, tableItem);
        };
        return <SimpleTableCell key={'col-' + columnIndex}
            columnIndex={columnIndex}
            tableColumn={tableColumn}
        >
            <TextField
                value={tableItem[tableColumn.id]}
                onChange={(_, newValue): void => setValue(newValue)}
                placeholder={tableColumn.name}
                width={TextFieldWidth.standard}
                spellCheck={false}
                inputClassName={styles.ruleInput}
            />
        </SimpleTableCell>;
    }
}
