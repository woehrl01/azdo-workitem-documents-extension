export type ChangeHandler<T> = (rowIndex: number, tableItem: T) => void;

export interface CustomEditCellProps<T> {
    id: string;
    name: string;
    width: number;
    onEdit: ChangeHandler<T>;
};

export class CustomEditCell<T> {
    private onEdit: ChangeHandler<T>;
    public id: string;
    public width: number;
    public name: string;
    public constructor(props: CustomEditCellProps<T>) {
        this.onEdit = props.onEdit;
        this.id = props.id;
        this.width = props.width;
        this.name = props.name;
    }

    protected setValue(rowIndex: number, tableItem: T, val: string): void {
        const newItem = { ...tableItem, [this.id]: val };
        this.onEdit(rowIndex, newItem);
    }
}


