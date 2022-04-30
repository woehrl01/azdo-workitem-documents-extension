import { Table } from 'azure-devops-ui/Table';
import { buildTableItems, columns } from './table.definition';
import { ITableItem } from './types';

interface IRulesTableProps {
    isLoading: boolean;
    rules: Array<ITableItem>;
    onDelete: (target: ITableItem) => void;
    onChange: (rowIndex: number, target: ITableItem) => void;
}

export const RulesTable = ({ onDelete, onChange, isLoading, rules }: IRulesTableProps): JSX.Element => {
    return <Table<ITableItem>
        ariaLabel="Rules Table"
        columns={columns(onDelete, onChange)}
        containerClassName="h-scroll-auto"
        itemProvider={buildTableItems(isLoading, rules)}
        role="table"
    />;
};
