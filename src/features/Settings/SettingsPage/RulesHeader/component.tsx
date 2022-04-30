import { Header, TitleSize } from 'azure-devops-ui/Header'
import { IHeaderCommandBarItem } from 'azure-devops-ui/HeaderCommandBar';

interface IRulesHeaderProps {
    addNewItem: () => void;
    isLoading: boolean;
}

const commandBar = (disabled: boolean, onActivate: () => void): IHeaderCommandBarItem[] => {
    return [
        {
            iconProps: {
                iconName: 'Add'
            },
            id: 'create',
            important: true,
            isPrimary: true,
            disabled: disabled,
            onActivate: onActivate,
            text: 'Add rule',
            tooltipProps: {
                text: 'Add new rule'
            },
        }
    ];
};

export const RulesHeader = ({ isLoading, addNewItem }: IRulesHeaderProps): JSX.Element => {
    return <Header
        title="Embedded Documents"
        titleSize={TitleSize.Large}
        commandBarItems={commandBar(isLoading, addNewItem)}
    />
}
