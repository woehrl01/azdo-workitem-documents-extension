import { TextField, TextFieldWidth } from 'azure-devops-ui/TextField';
import styles from './style.module.scss';
import { ITableColumn, SimpleTableCell } from 'azure-devops-ui/Table';
import { CustomEditCell, CustomEditCellProps } from './CustomEditCell';
import { FormItem } from 'azure-devops-ui/FormItem';

interface InputCellProps<T> extends CustomEditCellProps<T> {
    hasError: (value: string) => boolean;
    hasErrorMessage: string
}

export class InputCell<T> extends CustomEditCell<T> {
    hasError: (value: string) => boolean;
    hasErrorMessage: string;

    constructor(props: InputCellProps<T>) {
        super(props);
        this.hasError = props.hasError;
        this.hasErrorMessage = props.hasErrorMessage;
    }

    public renderCell(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<T>, tableItem: T, _ariaRowIndex?: number): JSX.Element {
        const value = tableItem[this.id];
        const hasError = this.hasError(value);

        return <SimpleTableCell
            key={'col-' + columnIndex}
            columnIndex={columnIndex}
            tableColumn={tableColumn}
        >
            <FormItem message={hasError ? this.hasErrorMessage : ''} error={hasError}>
                <TextField
                    value={value}
                    onChange={(_, newValue): void => this.setValue(rowIndex, tableItem, newValue)}
                    placeholder={tableColumn.name}
                    width={TextFieldWidth.standard}
                    autoComplete={false}
                    spellCheck={false}
                    inputClassName={styles.ruleInput}
                />
            </FormItem>
        </SimpleTableCell>;
    }
}
