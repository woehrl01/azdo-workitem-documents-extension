
export type ITableItem = {
    rule: string;
    type: RuleType;
};
type RuleType = 'allow' | 'block';

export type ChangeHandler = (rowIndex: number, tableItem: ITableItem) => void;
