interface IContentProps {
    children?: React.ReactNode;
}

export const Content = ({ children }: IContentProps): JSX.Element => {
    return <div className="page-content">
        {children}
    </div>
}
